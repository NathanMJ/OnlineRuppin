import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';




export async function getIngredientById(id) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    const db = client.db(process.env.DB_NAME);
    let ingredients = await db.collection("ingredients").findOne({ _id: id })

    if (!ingredients.changes_detail) {
      const temp = await db.collection('ingredients').findOne({ _id: -1 })
      const changes_detail = temp.changes_detail
      ingredients = { ...ingredients, changes_detail }
    }

    //changes the changes_detail to the real name

    const changeWithName = await Promise.all(
      ingredients.changes_detail.map(async (changes) => {
        const totalChange = await db.collection('ingredient_changes').findOne({ _id: changes.change_code })
        return changes.price ? { ...totalChange, price: changes.price } : { ...totalChange, price: 0 }
      }))


    delete ingredients.changes_detail

    ingredients = { ...ingredients, changes: changeWithName }


    return ingredients;
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

