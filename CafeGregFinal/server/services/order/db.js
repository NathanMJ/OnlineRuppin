import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';
import { findProductById } from '../product/db.js';
import { getIngredientById } from '../ingredient/db.js';
import { getStatusByOrderId } from '../status/db.js';
import { get } from 'http';
import { getOrdersOfTable } from '../table/db.js';




export async function getOrderById(id) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    const db = client.db(process.env.DB_NAME);
    let order = await db.collection("orders").findOne({ _id: id })

    const product = await findProductById(order.productId)

    //of product we need just img, name, price

    const { img, name, price, destination } = product



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
        //get the price of the change or 0 if not exist
        const price = ingredient.changes.find(ch => ch._id == change)?.price || 0

        delete ingredient.changes

        tempChanges.push({ ...ingredient, change: realChange.change, price })
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
          const ingredientAdded = { name: ingredient.name, price, _id: add }
          return ingredientAdded
        })
      )
      order.adds = tempAdds
    }


    const status = await getStatusByOrderId(id)


    return { ...order, img, name, price, status, destination };
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

    // Check if the order got the status

    // Check if status after exist, if yes erase them
    await db.collection('order_status_history').deleteMany({
      orderId: orderId,
      code: { $gt: statusId }
    });

    // For every status before if they don't exist create them with the same time by now

    // Récupérer tous les codes existants pour cet orderId
    const existingCodes = await db.collection('order_status_history')
      .find({ orderId: orderId }, { projection: { code: 1 } })
      .toArray();

    const existingSet = new Set(existingCodes.map(doc => doc.code));

    // Obtenir l'heure actuelle en format ISO (2025-10-05T09:06:56.113+00:00)
    const currentTime = new Date()

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

    let order = await getOrderById(id)

    //add the add price of add ingredients
    const addPrice = order.adds?.reduce((sum, add) => sum + (add.price || 0), 0) || 0
    //add the price of the salad
    const saladPrice = order.salad?.price || 0
    //add the price of ingredients that have change for changes
    const changesPrice = order.changes?.reduce((sum, change) => sum + (change.price || 0), 0) || 0

    return { price: order.price + addPrice + saladPrice + changesPrice }
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

export async function getOrdersFromDestinationInDB(destinationId) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    const db = client.db(process.env.DB_NAME);

    //get every orders of the tables
    const tables = await db.collection('tables').find({}).toArray()
    //get the orders with their status and destination
    let everyTablesOrders = await Promise.all(
      tables.map(async (table) => {
        const orders = await getOrdersOfTable(table._id);
        return { tableId: table._id, orders: orders.orders || [] };
      })
    );


    //get only the orders with the status between 1 and 3 included with destinationId
    everyTablesOrders.map((t) => {
      t.orders = t.orders.filter(o => 1 <= o.status._id && o.status._id <= 3 && o.destination == destinationId)
    })

    //clean every empty table
    everyTablesOrders.filter(t => t.orders && Array.isArray(t.orders) && t.orders.length > 0)

    //get the time of status ordered
    const everyTableHistories = await Promise.all(
      // 1. We map over the tables. This creates an array of Promises.
      everyTablesOrders.map(async (t) => {

        // 2. We create another array of Promises for the database lookups.
        const orderHistoryPromises = t.orders.map(o => {
          // 3. The query now correctly looks for status 1.
          // Note: I'm assuming the status field is named 'statusId'. Adjust if needed.
          return db.collection('order_status_history').findOne({
            orderId: o._id,
            code: 1 // This is the crucial missing part
          });
        });

        // 4. We use Promise.all HERE to wait for all the inner database queries to finish.
        const ordersWithStatus1 = await Promise.all(orderHistoryPromises);

        // 5. We return the table's data, filtering out any null results
        //    (in case an order didn't have a history record for status 1).
        return { tableId: t.tableId, orders: ordersWithStatus1.filter(Boolean) };
      })
    );


    // flat the orders 
    const allOrders = everyTableHistories.flatMap(table =>
      table.orders.map(order => ({
        ...order,
        tableId: table.tableId
      }))
    );

    allOrders.sort((a, b) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateA - dateB;
    });


    //group the orders by table
    const ordersGrouped = allOrders.reduce((acc, currentOrder) => {
      if (acc.length == 0) {
        const { orderId, tableId } = currentOrder;
        return [{ tableId, orders: [orderId] }]
      }
      else {
        const lastTableId = acc[acc.length - 1].tableId
        const { orderId, tableId } = currentOrder
        if (tableId == lastTableId) {
          acc[acc.length - 1].orders.push(orderId)
        }
        else {
          acc.push({ tableId, orders: [orderId] })
        }
        return acc
      }

    }, [])


    //change the of id by the real order

    const orderGroupedWithRealOrders = ordersGrouped.map((groupOfOrder) => {
      //everyTablesOrders is the objet with the full orders  

      const tableIdOfTheGroup = groupOfOrder.tableId

      const tempTable = everyTablesOrders.find(t => t.tableId == tableIdOfTheGroup)

      //change the ids of the table by the orders
      const fullOrders = groupOfOrder.orders.reduce((acc, orderId) => {
        const tempOrder = tempTable.orders.find(o => o._id == orderId)

        acc.push(tempOrder)
        return acc
      }, [])

      return { tableId: tableIdOfTheGroup, orders: fullOrders }
    })



    for (let table of orderGroupedWithRealOrders) {
      for (let order of table.orders) {
        /*3 options:
          order : set the ordered_status and no preparation
          in preparation : set the in preparation and get the ordered from the top
          ready : get ordered and no preparation
        */

        if (order.status.code == 1) {
          //order : set the ordered_status and no preparation
          order.ordered_status_time = order.status.time
        }
        else if (order.status.code == 2) {
          //in preparation : set the in preparation and get the ordered from the top
          order.preparation_status_time = order.status.time

          const orderedStatus = allOrders.find(o => o.orderId == order._id)
          order.ordered_status_time = orderedStatus.time

        }
        else if (order.status.code == 3) {
          //ready : get ordered and no preparation
          const orderedStatus = allOrders.find(o => o.orderId == order._id)
          order.ordered_status_time = orderedStatus.time
          order.ready_status_time = order.status.time
        }
      }
    }


    return { orders: orderGroupedWithRealOrders }
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
