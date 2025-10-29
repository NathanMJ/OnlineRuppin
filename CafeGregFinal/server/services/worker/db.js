import { __dirname } from '../../globals.js';
import { MongoClient, ObjectId } from 'mongodb';

function capitalize(word) {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}


export async function getWorkerFromDB(profile, workerId) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        let worker = await db.collection("workers").aggregate([
            {
                $match: { profile }
            },
            {
                $unwind: "$workers"
            },
            {
                $match: { "workers._id": workerId }
            },
            {
                $replaceRoot: { newRoot: "$workers" }
            }
        ]).next();

        if (!worker) {
            return null;
        }


        //get the authorizations 

        
        const authorizations = await db.collection('worker_authorizations').find().toArray();


        worker.authorizations.forEach(auth => {
            const authName = authorizations.find(a => a._id === auth)?.name || "unknown";
            worker[`is${capitalize(authName)}`] = true
        });

        delete worker.authorizations

        return worker;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            await client.close();
        }
    }
}
export async function entryWorker(workerId, clickerId) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        const startTime = new Date()

        // Check if there is a doc with a shift with only entry
        let exist = await db.collection('workers_shifts').findOne({
            workerId,
            startTime: { $exists: true },
            pauseTime: { $exists: false }
        })

        if (exist) {
            return { success: false, message: "The worker is already working, go to the manager to fix it" }
        }

        await db.collection('workers_shifts').insertOne({
            workerId,
            startId: clickerId,
            startTime
        })

        return { success: true, startTime } // ✅ Retourne un objet avec success
    }
    catch (error) {
        console.error('Erreur attrapee dans entryWorker:', error)
        return { success: false, message: error.message } // ✅ Retourne l'erreur
    }
    finally {
        if (client) {
            await client.close() // ✅ Ajoutez await
        }
    }
}


export async function pauseWorker(workerId, clickerId) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        const pauseTime = new Date()

        // Check if there is a doc with a shift with only entry
        let exist = await db.collection('workers_shifts').findOne({
            workerId,
            startTime: { $exists: true },
            pauseTime: { $exists: false }
        })

        if (!exist) {
            throw new Error("The worker is not working")
        }

        const result = await db.collection('workers_shifts').updateOne(
            { workerId, pauseTime: { $exists: false } },
            {
                $set: {
                    pauseId: clickerId,
                    pauseTime
                }
            }
        )

        // ✅ Vérifier que l'update a fonctionné
        if (result.matchedCount === 0) {
            throw new Error("No active shift found")
        }

        if (result.modifiedCount === 0) {
            throw new Error("Failed to update shift")
        }

        return { success: true, pauseTime } // ✅ Retourne un objet avec success
    }
    catch (error) {
        console.error('Erreur attrapee dans pauseWorker:', error)
        return { success: false, error: error.message } // ✅ Retourne l'erreur
    }
    finally {
        if (client) {
            await client.close() // ✅ Ajoutez await
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
            await client.close()
    }
}

export async function getEveryEntriesWithWorkersFromDB() {
    let client;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        // 1️⃣ Récupérer tous les workers (juste _id et name)
        const workers = await db.collection('workers')
            .find({}, { projection: { _id: 1, name: 1 } })
            .toArray();

        // 2️⃣ Pour chaque worker, récupérer ses entrées via getEntriesFromDB
        // Ici on doit passer worker._id
        const entriesWithWorkers = await Promise.all(
            workers.map(async (w) => {
                const entries = await getEntriesFromDB(w._id); // ✅ ta fonction existante
                return {
                    worker: w,
                    entries,
                };
            })
        );

        return entriesWithWorkers;
    } catch (err) {
        console.error("Error in getEveryEntriesWithWorkersFromDB:", err);
        return null;
    } finally {
        if (client) await client.close();
    }
}

