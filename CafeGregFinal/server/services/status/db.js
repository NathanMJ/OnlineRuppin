import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';

export async function getStatusByOrderId(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        let lastStatus = await db.collection("order_status_history").aggregate([
            { $match: { orderId: Number(id) } },
            { $sort: { time: -1, code: -1 } },
            { $limit: 1 }
        ]).toArray();
        lastStatus = lastStatus[0]

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

export async function getEveryStatusFromDB() {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        let everyStatus = await db.collection("order_status_history").aggregate([
            // NOUVELLE ÉTAPE 0 : Filtrer les documents de statut (code >= 1)
            {
                $match: {
                    code: { $gte: 2 }
                }
            },

            // 1. Jointure avec 'orders'
            {
                $lookup: {
                    localField: "orderId",
                    from: "orders",
                    foreignField: "_id",
                    as: "order"
                }
            },

            // 2. Jointure avec 'products'
            {
                $lookup: {
                    localField: "order.productId",
                    from: "products",
                    foreignField: "_id",
                    as: "product"
                }
            },

            // 3. AUTO-JOINTURE : Récupérer le temps du statut N-1 (dynamique)
            // Cette étape cherche le statut N-1 pour tous les documents filtrés.
            {
                $lookup: {
                    from: "order_status_history",
                    let: { currentOrderId: "$orderId", currentCode: "$code" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$orderId", "$$currentOrderId"] },
                                        { $eq: ["$code", { $subtract: ["$$currentCode", 1] }] }
                                    ]
                                }
                            }
                        },
                        { $limit: 1 },
                        { $project: { _id: 0, time: 1 } }
                    ],
                    as: "previousStatusTime"
                }
            },

            // 4. Projection et Nettoyage Final (avec condition sur previousTime)
            {
                $project: {
                    // Champs de la collection de départ
                    _id: 1,
                    time: 1,
                    code: 1,

                    // CONDITIONNEL : Afficher previousTime UNIQUEMENT si code est 2
                    previousTime: {$arrayElemAt: ["$previousStatusTime.time", 0 ]},

                // Extraction des infos produit
                productName: { $arrayElemAt: ["$product.name", 0] },
                productId: { $arrayElemAt: ["$product._id", 0] },
                productImage: { $arrayElemAt: ["$product.img", 0] },
                productDestination: { $arrayElemAt: ["$product.destination", 0] }
            }
            }
        ]).toArray();

    let statusDetails = await db.collection('order_status').aggregate([
        // NOUVELLE ÉTAPE 0 : Filtrer les documents de statut (code >= 1)
        {
            $match: {
                _id: { $gte: 1 }
            }
        }]).toArray()

    return { everyStatus, statusDetails, ok: true };

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


