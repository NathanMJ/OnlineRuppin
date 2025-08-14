import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';
import { getIngredientById } from '../ingredient/db.js';




export async function findAllProducts() {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    const db = client.db(process.env.DB_NAME);
    const products = await db.collection("products").find({}).toArray()
    return products;
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
            from: "sauces",
            localField: "sauces",
            foreignField: "_id",
            as: "sauces"
          }
        }
      ])
      .toArray())[0];

    const tempIngredients = product.ingredients
    const ingredients = await Promise.all(
      tempIngredients.map(async (i) => {
        const id = i._id ?? i
        const ingredient = await getIngredientById(id)
        const selected = i.selected ?? 1
        return { ...ingredient, selected }
      })
    )

    if (product.adds) {
      const adds = await Promise.all(
        product.adds.map(async (a) => {
          const id = a.id
          const price = a.price ?? 0
          const ingredient = await getIngredientById(id)
          return { ...ingredient, price }
        })
      )
      product.adds = adds
    }

    if (product.salads) {
      const salads = await Promise.all(
        product.salads.map(async (s) => {
          const id = s._id ?? s
          const price = s.price ?? 0
          const salad = await db.collection('salads').findOne({ _id: id })
          return { ...salad, price }
        })
      )
      product.salads = salads
    }


    return { ...product, ingredients };
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


export async function findProductByName(name) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    const db = client.db(process.env.DB_NAME);

    const productsId = await db.collection("products")
      .find(
        { name: { $regex: name, $options: "i" } },
        { projection: { _id: 1, name: 1, img: 1 } }
      )
      .limit(3)
      .toArray();


    console.log(productsId);
    return productsId
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


