import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';
import { findProductById } from '../product/db.js';
import { getIngredientById } from '../ingredient/db.js';
import { getStatusByOrderId } from '../status/db.js';
import { get } from 'http';




export async function getOrderById(id) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    const db = client.db(process.env.DB_NAME);
    let order = await db.collection("orders").findOne({ _id: id })



    const product = await findProductById(order.productId)

    //of product we need just img, name, price

    const { img, name, price } = product


    if (order.sauces) {
      //get sauces with quantityconst sauces = [];
      let sauces = []
      for (const s of order.sauces) {
        const { id, quantity } = s;
        const sauce = await db.collection('sauces').findOne({ _id: id });
        if (sauce) {
          sauces.push({ ...sauce, quantity });
        }
      }
      order.sauces = sauces
    }


    //get the choosen salads 
    if (order.salad) {
      const id = order.salad._id ?? order.salad
      const salad = await db.collection('salads').findOne({ _id: id })
      const price = product.salads.find((s) => (s._id ?? s) == id).price ?? 0
      order = { ...order, salad: { ...salad, price } }
    }

    //get changes
    if (order.changes) {
      const tempChanges = []
      for (const c of order.changes) {
        const { ingredientId, change } = c;
        const ingredient = await getIngredientById(ingredientId)
        const realChange = await db.collection('ingredient_changes').findOne({ _id: change })
        delete ingredient.changes
        tempChanges.push({ ...ingredient, change: realChange.change })
      }
      order.changes = tempChanges

    }

    //get the ingredients that is not in changes

    let tempIngredients = []
    if (order.changes) {
      tempIngredients = product.ingredients.filter(i => !order.changes.some(c => {
        const ingredientId = i._id || i
        return ingredientId == c._id
      }))
    }
    else {
      tempIngredients = product.ingredients
    }
    order.ingredients = tempIngredients


    //get adds    

    if (order.adds) {
      const tempAdds = await Promise.all(
        order.adds.map(async (add) => {
          const ingredient = await getIngredientById(add)
          const price = product.adds.find(a => a._id == add).price
          const ingredientAdded = { name: ingredient.name, price }
          return ingredientAdded
        })
      )
      order.adds = tempAdds
    }


    const status = await getStatusByOrderId(id)


    return { ...order, img, name, price, status };
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

export async function removeOrderById(orderId) {
  let client = null;
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    const db = client.db(process.env.DB_NAME);

    await db.collection("tables").updateMany(
      { orders: orderId },
      { $pull: { orders: orderId } }
    );


    await db.collection("orders").deleteOne({ _id: orderId });

    await db.collection("order_status_history").deleteMany({ orderId: orderId });

    return { success: true, message: `Order ${orderId} supprimée avec succès` };

  } catch (error) {
    console.error('Error removing order:', error);
    return { success: false, message: error.message };
  } finally {
    if (client) await client.close();
  }
}

export async function changeOrderStatusById(orderId, statusId) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    const db = client.db(process.env.DB_NAME);


    //check if the order got the status

    //check if status after exist, if yes erase them

    await db.collection('order_status_history').deleteMany({
      orderId: orderId,
      code: { $gt: statusId }
    });

    //for every status before if they dont exist create them with the same time by now

    // Récupérer tous les codes existants pour cet orderId
    const existingCodes = await db.collection('order_status_history')
      .find({ orderId: orderId }, { projection: { code: 1 } })
      .toArray();

    const existingSet = new Set(existingCodes.map(doc => doc.code));

    // Obtenir l'heure actuelle en HH:MM:SS
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const currentTime = `${hh}:${mm}:${ss}`;

    // Créer tous les codes manquants
    const toInsert = [];
    for (let code = 0; code <= statusId; code++) {
      if (!existingSet.has(code)) {
        toInsert.push({
          orderId: orderId,
          code: code,
          time: currentTime
        });
      }
    }

    if (toInsert.length > 0) {
      const result = await db.collection('order_status_history').insertMany(toInsert);
      return { success: true, insertedCount: result.insertedCount };
    } else {
      return { success: true, insertedCount: 0 };
    }


    return
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

export async function getPriceByOrderId(id) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    const db = client.db(process.env.DB_NAME);

    let order = await getOrderById(id)

    //add the add price of add ingredients
    const addPrice = order.adds?.reduce((sum, add) => sum + (add.price || 0), 0) || 0
    //add the price of the salad
    const saladPrice = order.salad?.price || 0
    //add the price of ingredients that have change for changes

    return { price: order.price + addPrice + saladPrice }
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

