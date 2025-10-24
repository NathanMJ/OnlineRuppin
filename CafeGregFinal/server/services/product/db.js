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


export async function findProductById(productId, profile, detailsToKeep) {

  //TODO: finish the function with and without base

  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    const db = client.db(process.env.DB_NAME);
    const product = await db.collection("products")
      .aggregate([
        {
          $match: { profile }
        },
        {
          $unwind: "$products"
        },
        {
          $match: { "products._id": Number(productId) }
        },
        {
          $replaceRoot: { newRoot: "$products" }
        }
      ])
      .next();
    console.log(product);


    if (detailsToKeep.length > 0) {
      //keep only the details
      const everyDetails = Object.keys(product)
      for (const detail of everyDetails) {
        if (detailsToKeep.some(d => d != detail)) {
          delete product[detail]
        }
      }
    }

    return { product, ok: true }

    //get the sauces

    /**
     * ,
        {
          $lookup: {
            from: "sauces",
            localField: "sauces",
            foreignField: "_id",
            as: "sauces"
          }
        }
     */

    if (product.ingredient) {

      const tempIngredients = product.ingredients || []
      const ingredients = await Promise.all(
        tempIngredients.map(async (i) => {
          const id = i._id ?? i
          const ingredient = await getIngredientById(id)
          const selected = i.selected ?? 1
          return { ...ingredient, selected }
        })
      )
    }

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

export async function changeProductInDB(newProduct) {

  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    const db = client.db(process.env.DB_NAME);
    await db.collection('products').updateOne(
      { _id: newProduct._id },
      {
        $set: {
          name: newProduct.name, price: newProduct.price, img: newProduct.img,
          description: newProduct.description
        }
      }
    )
    const test = await db.collection('products').findOne({ _id: newProduct._id })
    console.log('test', test);

    return { message: 'Did change', ok: true }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error
  }
  finally {
    if (client) {
      client.close();
    }
  }
}



