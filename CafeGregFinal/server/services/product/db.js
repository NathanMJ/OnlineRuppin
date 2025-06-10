import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';




export async function findAllProducts() {    
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        
        const db = client.db(process.env.DB_NAME); 
        const products = await db.collection("products").find({}).toArray()
        return products;       
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


export async function findProductById(id) {    
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        
        const db = client.db(process.env.DB_NAME); 
        const product = (await db.collection("products")
      .aggregate([
        { $match: { _id: id } },
        {
          $lookup: {
        from: "ingredients",
        localField: "ingredients",
        foreignField: "_id",
        as: "ingredients"
          }
        },
        {
          $lookup: {
        from: "sauces",
        localField: "sauces",
        foreignField: "_id",
        as: "sauces"
          }
        }
      ])
      .toArray())[0];

       return product;       
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
