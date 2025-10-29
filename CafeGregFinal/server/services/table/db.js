import { __dirname } from '../../globals.js';
import { MongoClient, ObjectId } from 'mongodb';
import { getOrderById, getPriceByOrderId } from '../order/db.js';

export async function findAllTables(profile) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        const res = await db.collection("tables").findOne({ profile })
        let tables = res.tables || []
        if (tables.length === 0) {
            return tables
        }
        //get the orders from each table

        await Promise.all(
            tables.map(async (table) => {
                if (table.orders?.length > 0) {
                    const orders = await Promise.all(
                        table.orders.map(async (o) => {
                            return await getOrderById(profile, o)
                        })
                    )
                    table.orders = orders
                }
            }))

        return tables;
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


export async function getOrdersOfTable(profile, tableId) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        const table = await db.collection("tables").aggregate([
            { $match: { profile } },
            { $unwind: "$tables" },
            { $match: { "tables._id": tableId } },
            { $replaceRoot: { newRoot: '$tables' } }
        ]).next()

        console.log(table);


        if (!table.orders)
            return []

        const ordersIds = table.orders
        const orders = await Promise.all(
            ordersIds.map(async (o) => {
                return await getOrderById(profile, o)
            })
        )

        return orders;
    } catch (error) {
        return { ok: false, message: error.message };
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

export async function addOrderToTable(profile, tableId, order) {

    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        //check if the collection exist and 

        const collection = await db.collection("orders").findOne({ profile },
            { projection: { orders: 0 } })


        //if profile does not exist

        if (!collection) {
            const created = await db.collection("orders").insertOne({ profile, orders: [] },
                { projection: { orders: 0 } })
            if (!created.acknowledged) {
                return { message: "Problem adding collections orders in addOrderToTable" }
            }
        }


        let res = await db.collection("orders").aggregate([
            { $match: { profile } }
            , { $unwind: "$orders" }
            , { $sort: { "orders._id": -1 } }
            , { $limit: 1 }
        ]).next()

        const lastOrder = res?.orders || null
        const orderId = lastOrder?._id + 1 || 0
        const orderWithId = { ...order, _id: orderId }


        res = await db.collection("orders").updateOne({ profile }, { $push: { orders: orderWithId } })
        if (!res.acknowledged) {
            return { message: "Didn't added the order into the orders collections" }
        }


        // Mettre à jour la table : ajouter l'id de la commande dans le tableau orders (optionnel)

        res = await db.collection("tables").updateOne(
            { profile },
            {
                $push: {
                    'tables.$[tableItem].orders': orderId

                }
            }, {
            arrayFilters: [
                { "tableItem._id": tableId }
            ]
        }
        );

        if (!res.acknowledged) {
            return { message: "Didn't added the order into the tables collections" }
        }

        //set the status 0 to the order in order_status_history with the time

        const time = new Date();

        const statusToAdd = { code: 0, time }

        //check if the collection exist 

        res = await db.collection('order_status_history').findOne({ profile }, { projection: { order_change_status: 0 } })

        if (!res) {
            res = await db.collection('order_status_history').insertOne({ profile, order_change_status: [] })

            if (!res.acknowledged) {
                return { message: "Didn't create the order status history profile" }
            }
        }

        res = await db.collection('order_status_history').updateOne({
            profile
        },
            {
                $push: {
                    order_change_status: { orderId, status: [statusToAdd] }
                }
            }
        )

        if (!res.acknowledged) {
            return { message: "Didn't added the order into the order status history collections" }
        }
        return { ok: true, message: "Order added", order: orderWithId };
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

export async function changeStatusInDB(profile, tableId, statusId) {
    let client = null
    try {

        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);


        //check if table exists
        // const table = await db.collection("tables").findOne({ _id: Number(id) })
        // if (!table) {
        //     return { success: false, message: `Table ${id} doesnt exist` };
        // }

        await db.collection("tables").updateOne(
            {
                profile, "tables._id": tableId
            },
            {
                $set: { "tables.$.status": statusId }
            })

        return { ok: true, message: `Table ${tableId} was changed to status ${statusId}`, success: true };
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
