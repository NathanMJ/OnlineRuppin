import { __dirname } from '../../globals.js';
import { MongoClient, ObjectId } from 'mongodb';
import { findProductById } from '../product/db.js';
import { getOrderById } from '../order/db.js';

export async function findAllTables() {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        const tables = await db.collection("tables").find({}).toArray()
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

export async function findTableById(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        const table = await db.collection("tables").findOne({ _id: id })

        return table;
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
        
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const time = `${hh}:${mm}:${ss}`;

        const statusToAdd = {time, code: 0, orderId : idOrder}

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

export async function getOrdersOfTable(tableId) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        const table = await db.collection("tables").findOne({ _id: Number(tableId) })


        if (!table.orders)
            return { success: true, orders: [] }

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
