
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';


export async function connectToWebsite(login, password) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);

        const db = client.db(process.env.DB_NAME);
        const found = await db.collection("website").findOne({ login: login, password: password })
        if (!found)
            return { message: "Not found" }
        return { profile: found.profile, message: 'Connecting' };
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

export async function addTokenInDB(profile, token) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        //check if the profile exist
        const profileExist = await db.collection('profiles').findOne({ profile })
        if (!profileExist) {
            return { message: 'The profile does not exist.' }
        }

        //check if the token exist
        const tokenExist = await db.collection("tokens").findOne({ profile, tokens: token })
        console.log(tokenExist);

        if (tokenExist) {
            return { message: 'Token already exist.' }
        }

        await db.collection("tokens").updateOne(
            { profile: profile },
            {
                $addToSet: {
                    tokens: token
                },
                $setOnInsert: {
                    profile: profile
                }
            },
            { upsert: true }

        ); return { ok: true, message: 'Token inserted' };
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


export async function getTokenInDB(profile, token) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        //check if the token exist
        const tokenExist = await db.collection("tokens").findOne({ profile, tokens: token })

        if (!tokenExist) {
            return { message: 'Token does not exist.' }
        }
        return { ok: true, message: 'Token exist' };
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
