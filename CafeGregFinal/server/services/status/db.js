import { log } from 'node:console';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';

export async function getStatusByOrderId(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        let lastStatus = await db.collection("order_status_history").aggregate([
            { $match: { orderId: Number(id) } },
            { $sort: { time: -1 , code: -1} },
            { $limit: 1 }
        ]).toArray();
        lastStatus = lastStatus[0]
        console.log('lastStatus', lastStatus);

        const fullStatus = await db.collection('order_status').findOne({ _id: Number(lastStatus.code) })

        if (lastStatus) {
            return { ...lastStatus, ...fullStatus };
        } else {
            return null;
        }
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
