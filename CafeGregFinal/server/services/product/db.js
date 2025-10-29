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


export async function findProductById(profile, productId, detailsToKeep = []) {
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



    if (detailsToKeep.length > 0) {
      //keep only the details
      const detailsOfTheProduct = Object.keys(product)
      for (const detailOfProduct of detailsOfTheProduct) {
        if (!detailsToKeep.some(d => d == detailOfProduct)) {
          delete product[detailOfProduct]
        }
      }
    }


    //get the sauces

    if (product.sauces) {
      const sauces = await Promise.all(
        product.sauces.map(async (s) => {
          const temp = await db.collection("sauces").aggregate([
            { $match: { profile } }
            , { $unwind: "$sauces" }
            , { $project: { _id: 0, profile: 0 } }
            , { $match: { "sauces._id": s } }
            , { $replaceRoot: { newRoot: "$sauces" } }
          ]).next()
          return temp
        })
      )
      product.sauces = sauces
    }




    if (product.ingredients) {

      const ingredients = await Promise.all(
        product.ingredients.map(async (i) => {
          const id = typeof i == 'number' ? i : i._id
          const ingredient = await getIngredientById(profile, id)
          const selected = i.selected ?? 1
          return { ...ingredient, selected }
        })
      )
      product.ingredients = ingredients
    }



    if (product.adds) {
      const adds = await Promise.all(
        product.adds.map(async (a) => {
          const id = a.id
          const price = a.price ?? 0
          //TODO: add the possibility of changes with additionnal price why not
          const ingredient = await getIngredientById(profile, id, false)
          return { ...ingredient, price }
        })
      )
      product.adds = adds
    }



    if (product.salads) {
      const salads = await Promise.all(
        product.salads.map(async (s) => {
          const id = typeof s == "number" ? s : s._id
          const price = s.price ?? 0
          const salad = await db.collection('salads').aggregate([
            { $match: { profile } }
            , { $project: { profile: 0, _id: 0 } }
            , { $unwind: '$salads' }
            , { $match: { "salads._id": id } }
            , { $replaceRoot: { newRoot: "$salads" } }
          ]).next()
          return { ...salad, price }
        })
      )
      product.salads = salads
    }


    return product
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


export async function findProductByName(profile, research) {
  let client = null
  const max = 3
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    const db = client.db(process.env.DB_NAME);

    const res = await db.collection("products").aggregate([
      {
        $match: {
          profile: profile
        }
      },
      {
        $unwind: "$products"
      },
      {
        $match: {
          "products.name": { $regex: research, $options: "i" }
        }
      }, {
        $limit: max
      },
      {
        $group: {
          _id: null,
          productIds: { $push: "$products._id" }
        }
      },
      {
        $project: {
          _id: 0,
          productIds: 1
        }
      }
    ]).next();


    const productsIds = res ? res.productIds : [];

    const products = await Promise.all(
      productsIds.map(async (id) => {
        return await findProductById(profile, id, ['_id', "img", 'name'])
      })
    )

    return products
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



