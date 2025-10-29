import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';





export async function getIngredientById(profile, ingredientId, withChanges = true) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    const db = client.db(process.env.DB_NAME);
    let ingredient = await db.collection("ingredients").aggregate([
      { $match: { profile } },
      { $project: { _id: 0, profile: 0 } },
      { $unwind: "$ingredients" },
      { $match: { "ingredients._id": Number(ingredientId) } },
      { $replaceRoot: { newRoot: "$ingredients" } }
    ]).next()

    if (!ingredient) {
      return {}
    }

    if (!withChanges) {
      return ingredient
    }

    if (!ingredient.changes_detail) {
      const baseIngredient = await getIngredientById(profile, -1, false)
      const changes_detail = baseIngredient.changes_detail
      ingredient = { ...ingredient, changes_detail }
    }

    //changes the changes_detail to the real name

    const changeWithName = await Promise.all(
      ingredient.changes_detail.map(async (change) => {
        const changeId = typeof change == 'number' ? change : change.change_code
        const totalChange = await db.collection('ingredient_changes').aggregate([
          {
            $match: { _id: changeId }
          }
        ]).next()

        return { ...totalChange, price: change.price ?? 0 }
      }))


    delete ingredient.changes_detail

    ingredient = { ...ingredient, changes: changeWithName }


    return ingredient;
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

