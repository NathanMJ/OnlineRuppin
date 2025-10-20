
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';


export async function connectToWebsite(login, password, token) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);

        const db = client.db(process.env.DB_NAME);
        const found = await db.collection("website").findOne({ login: login, password: password })
        if (!found)
            return { message: "Not found" }
        const res = await(addTokenInDB(found.profile, token))
        if(!res.ok){
            return {message : res.message}
        }
        return { profile: found.profile, message: 'Connecting', totalTokens: res.totalTokens};
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



        );

        const res = await db.collection("tokens").aggregate([
            { $match: { profile } },
            {
                $project: {
                    quantityOfToken: { $size: "$tokens" },
                    _id: 0
                }
            }
        ]).toArray()
        const quantityOfToken = res.length > 0 ? res[0].quantityOfToken : 0
        console.log(quantityOfToken);


        return { ok: true, message: 'Token inserted', totalTokens : quantityOfToken};
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


