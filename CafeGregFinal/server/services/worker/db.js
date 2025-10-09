import { __dirname } from '../../globals.js';
import { MongoClient, ObjectId } from 'mongodb';

function capitalize(word) {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}


export async function getWorkerFromDB(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        let worker = await db.collection("workers").aggregate([
            {
                $match: { _id: id }
            },
            {
                $lookup: {
                    localField: "authorizations",   // tableau d’IDs
                    from: "worker_authorizations",
                    foreignField: "_id",            // champ dans worker_authorizations
                    as: "authorizations"            // ça remplace le tableau par les objets
                }
            }
        ]).toArray();


        if (worker.length > 0)
            worker = worker[0]
        else
            return



        worker.authorizations.forEach(auth => {
            worker[`is${capitalize(auth.name)}`] = true
        });

        delete worker.authorizations

        return worker;
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

export async function entryWorker(workerId, clickerId) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        const startTime = new Date()
        //check if there is a doc with a shift with only entry
        let exist = await db.collection('workers_shifts').findOne({
            workerId,
            startTime: { $exists: true },
            pauseTime: { $exists: false }
        })
        if (exist) {
            throw new Error("The worker is already connected")
        }
        await db.collection('workers_shifts').insertOne({
            workerId,
            startId: clickerId,
            startTime
        })
        return startTime
    }
    catch (error) {
        console.error('Erreur attrapee', error)
    }
    finally {
        if (client) {
            client.close
        }
    }
}


export async function pauseWorker(workerId, clickerId) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        const pauseTime = new Date()
        //check if there is a doc with a shift with only entry
        let exist = await db.collection('workers_shifts').findOne({
            workerId,
            startTime: { $exists: true },
            pauseTime: { $exists: false }
        })
        if (!exist) {
            throw new Error("The worker is not working")
        }
        await db.collection('workers_shifts').updateOne({
            workerId, pauseTime: {$exists: false}} , { $set: {
                pauseId: clickerId,
                pauseTime
            }})
        return pauseTime
    }
    catch (error) {
        console.error('Erreur attrapee', error)
    }
    finally {
        if (client) {
            client.close
        }
    }
}

export async function getEntriesFromDB(workerId) {
    let client
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING)
        const db = client.db(process.env.DB_NAME)
        let shifts = await db.collection('workers_shifts').aggregate([
            {
                $match: {
                    workerId: workerId,
                    startTime: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        $lt: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }
            },
            {
                $lookup: {
                    from: "workers",
                    localField: "startId",
                    foreignField: "_id",
                    as: "starter"
                }
            },
            { $unwind: { path: "$starter", preserveNullAndEmptyArrays: true } }, // 👈 transforme le tableau en objet

            {
                $lookup: {
                    from: "workers",
                    localField: "pauseId",
                    foreignField: "_id",
                    as: "pauser"
                }
            },
                { $unwind: { path: "$pauser", preserveNullAndEmptyArrays: true } } // 👈 transforme le tableau en objet

        ]).toArray()
        return shifts
    }
    catch (err) {

    }
    finally {
        if (client)
            client.close()
    }
}