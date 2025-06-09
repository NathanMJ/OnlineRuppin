import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';

export async function findAllTables() {    
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME); 
        const tables = await db.collection("tables").find({}).toArray()
        return tables;       
    }   catch (error){
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if(client){
            client.close();
        }
    }
}

export async function findTableById(id) {    
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME); 
        const table = await db.collection("tables").findOne({_id:id})

       return table;       
    }   catch (error){
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if(client){
            client.close();
        }
    } 
}

/*,
  {
    $lookup: {
      from: "ingredients",
      localField: "ingredientIds",
      foreignField: "_id",
      as: "ingredients"
    } */


// export async function findProductById(id) {    
//     let client = null
//     try {
//         client = await MongoClient.connect(process.env.CONNECTION_STRING);
        
//         const db = client.db(process.env.DB_NAME); 
//         const product = await db.collection("products").findOne({_id:id})
//         return product;       
//     }   catch (error){
//         console.error('Error connecting to MongoDB:', error);
//         throw error;
//     }
//     finally {
//         if(client){
//             client.close();
//         }
//     }
// }
