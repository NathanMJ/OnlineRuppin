
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';


export async function connectToWebsite(login, password) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);

        const db = client.db(process.env.DB_NAME);
        const website = await db.collection("website").findOne({ login: login, password: password })
        if(website)
            return true;
        return false;
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
