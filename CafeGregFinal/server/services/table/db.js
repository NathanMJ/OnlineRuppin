import { __dirname } from '../../globals.js';
import { MongoClient, ObjectId } from 'mongodb';
import { findProductById } from '../product/db.js';
import { getOrderById, getPriceByOrderId } from '../order/db.js';

export async function findAllTables(profile) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        const res = await db.collection("tables").findOne({ profile })
        return { ok: true, tables: res.tables || [] };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}


export async function getOrdersOfTable(tableId, profile) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        const table = await db.collection("tables").findOne({ tables: {_id: Number(tableId) }, profile })

    if (!table.orders)
        return { ok: true, orders: [] }

    const ordersId = table.orders
    const orders = await Promise.all(
        ordersId.map(async (o) => { return await getOrderById(o) })
    )

    return { success: true, orders };

} catch (error) {
    return { success: false, message: error.message };
} finally {
    if (client) {
        await client.close();
    }
}
}


export async function addTableById(id) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        const existingTable = await db.collection("tables").findOne({ _id: id });
        if (existingTable) {
            return { success: false, message: `Table ${id} existe déjà` };
        }

        const tableDocument = { _id: id };

        const result = await db.collection("tables").insertOne(tableDocument);

        if (result.acknowledged) {
            return { success: true, message: "OK", table: tableDocument };
        } else {
            return { success: false, message: "Échec insertion" };
        }

    } catch (error) {
        if (error.code === 11000) {
            return { success: false, message: `Table ${id} existe déjà` };
        }
        return { success: false, message: error.message };
    } finally {
        if (client) {
            await client.close();
        }
    }
}

export async function addOrderToTable(tableId, order) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        // Trouver le max orderId dans orders (collection séparée)
        const lastOrder = await db.collection("orders")
            .find()
            .sort({ _id: -1 })
            .limit(1)
            .toArray();

        const idOrder = (lastOrder.length === 0) ? 0 : lastOrder[0]._id + 1;

        // Ajouter orderId et tableId dans la commande
        const orderWithId = { ...order, _id: idOrder };


        // Insérer dans la collection orders
        const insertResult = await db.collection('orders').insertOne(orderWithId);
        if (!insertResult.acknowledged) {
            return { success: false, message: "Échec insertion order" };
        }

        // Mettre à jour la table : ajouter l'id de la commande dans le tableau orders (optionnel)

        const updateResult = await db.collection("tables").updateOne(
            { _id: Number(tableId) },
            { $push: { orders: idOrder } }
        );

        //set the status 0 to the order in order_status_history with the time

        const time = new Date();

        const statusToAdd = { time, code: 0, orderId: idOrder }

        await db.collection('order_status_history').insertOne(statusToAdd)




        if (updateResult.modifiedCount === 1) {
            return { success: true, message: "Commande ajoutée", order: orderWithId };
        } else {
            return { success: false, message: "Échec mise à jour table" };
        }

    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (client) await client.close();
    }
}


export async function getCustomersOfTableInDB(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        const customers = await db.collection("tables").aggregate([
            { $match: { _id: id } },
            {
                $lookup: {
                    localField: "customers",
                    from: "customers",
                    foreignField: "_id",
                    as: "customers"
                }
            }
        ]).toArray()
        if (customers.length === 0) {
            return null;
        }
        return customers[0].customers;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}

export async function deleteInDB(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        const table = await db.collection("tables").findOne({ _id: Number(id) })
        if (!table) {
            return { success: false, message: `Table ${id} doesnt exist` };
        }
        //delete every status of the orders of the table from order_status_history collection
        //delete every order of the table from orders collection
        if (table.orders && table.orders.length > 0) {
            await db.collection("order_status_history").deleteMany({ orderId: { $in: table.orders } });
            await db.collection("orders").deleteMany({ _id: { $in: table.orders } });
        }
        await db.collection("tables").deleteOne({ _id: Number(id) })
        return { message: `Table ${id} deleted`, success: true };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}

export async function changeStatusInDB(id, statusId) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        const table = await db.collection("tables").findOne({ _id: Number(id) })
        if (!table) {
            return { success: false, message: `Table ${id} doesnt exist` };
        }

        await db.collection("tables").updateOne({ _id: Number(id) }, { $set: { status: statusId } })

        return { message: `Table ${id} was changed to status ${statusId}`, success: true };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}

export async function getPriceOfTableInDB(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        const table = await db.collection("tables").findOne({ _id: Number(id) })
        if (!table) {
            return { success: false, message: `Table ${id} doesnt exist` };
        }
        if (!table.orders || table.orders.length === 0) {
            return { price: 0 };
        }

        let prices = await Promise.all(
            table.orders?.map(async (o) => {
                return (await getPriceByOrderId(o)).price
            })
        )
        const price = prices.reduce((acc, curr) => acc + curr, 0)


        return { price };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}



export async function payInDB(id, tipValue) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        //check if table exists
        const table = await db.collection("tables").findOne({ _id: Number(id) })
        if (!table) {
            return { success: false, message: `Table ${id} doesnt exist` };
        }
        //if there are customers set them in customer history

        const now = new Date();
        const historyEntry = {
            date: now,
            customers: table.customers || [],
            orders: table.orders || [],
            tip: tipValue || 0
        }
        await db.collection("customers_order_history").insertOne(historyEntry)

        //delete the table
        await db.collection("tables").deleteOne({ _id: Number(id) })


        return { success: true, message: `Table ${id} was payed` };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}


export async function switchTablesInDB(tableId, tableId2) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);


        //get the firstTable

        let table1 = await db.collection('tables').findOne({ _id: tableId })
        if (!table1) {
            table1 = { _id: tableId }
        }
        else {
            await db.collection('tables').deleteOne({ _id: tableId })
        }

        //get the secondTable

        let table2 = await db.collection('tables').findOne({ _id: tableId2 })
        if (!table2) {
            table2 = { _id: tableId2 }
        }
        else {
            await db.collection('tables').deleteOne({ _id: tableId2 })
        }


        //switch the ids
        table1._id = tableId2
        table2._id = tableId

        //insert the new ones

        await db.collection('tables').insertMany(
            [table1, table2]
        )


        return { success: true, message: `Tables ${tableId} and ${tableId2} were switched` };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}
