import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';
import { findProductById } from '../product/db.js';
import { getIngredientById } from '../ingredient/db.js';
import { getStatusByOrderId } from '../status/db.js';
import { get } from 'http';
import { getOrdersOfTable } from '../table/db.js';




export async function getOrderById(profile, orderId) {
  let client = null
  //TODO 
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    const db = client.db(process.env.DB_NAME);
    let order = await db.collection("orders").aggregate([
      { $match: { profile } },
      { $unwind: "$orders" },
      { $match: { "orders._id": orderId } },
      { $replaceRoot: { newRoot: "$orders" } }
    ]).next()

    if (!order) {
      return null
    }


    const product = await findProductById(profile, order.productId)

    //of product we need just img, name, price

    order = {
      ...order,
      img: product.img,
      name: product.name,
      price: product.price,
      destination: product.destination
    }



    if (order.sauces) {
      //get sauces with quantityconst sauces = [];
      let sauces = []
      for (const s of order.sauces) {
        const { _id, quantity } = s;
        const sauce = await db.collection('sauces').aggregate([
          { $match: { profile } },
          { $unwind: "$sauces" },
          { $match: { "sauces._id": _id } },
          { $replaceRoot: { newRoot: "$sauces" } }
        ]).next();
        if (sauce) {
          sauces.push({ ...sauce, quantity });
        }
      }
      order.sauces = sauces
    }

    //get the choosen salads 
    if (order.salad) {
      const id = order.salad._id ?? order.salad
      const salad = await db.collection('salads').aggregate([
        { $match: { profile } },
        { $unwind: "$salads" },
        { $match: { "salads._id": id } },
        { $replaceRoot: { newRoot: '$salads' } }
      ]).next()

      const price = product.salads.find((s) => (s._id ?? s) == id).price ?? 0
      order = { ...order, salad: { name: salad.name, price } }
    }

    //

    //get changes
    if (order.changes) {
      const tempChanges = []
      for (const c of order.changes) {
        const { ingredientId, change } = c;
        const ingredient = await getIngredientById(profile, ingredientId)
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
      tempIngredients = product.ingredients
        .filter(i => !order.changes.some(c => i._id == c._id))
        .map((i) => ({ name: i.name, _id: i._id }))
    }
    else {
      tempIngredients = product.ingredients.map(i => {
        return { name: i.name, _id: i._id }
      })
    }

    order.ingredients = tempIngredients


    //TODO

    //get adds    

    if (order.adds) {
      const tempAdds = await Promise.all(
        order.adds.map(async (add) => {
          const ingredient = await getIngredientById(profile, add)
          const price = product.adds.find(a => a._id == add).price
          const ingredientAdded = { name: ingredient.name, price, _id: add }
          return ingredientAdded
        })
      )
      order.adds = tempAdds
    }


    const status = await getStatusByOrderId(profile, order._id)

    return { ...order, status };
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

export async function removeOrderById(profile, orderId) {
  let client = null;
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    const db = client.db(process.env.DB_NAME);

    //remove from tables

    const tableId = (await db.collection("tables").aggregate([
      { $match: { profile } },
      { $unwind: "$tables" },
      { $match: { "tables.orders": orderId }}
    ]).next()).tables._id;


    let res = await db.collection("tables").updateOne(
      {
        profile,
        'tables.orders': orderId
      },
      {
        $pull: { "tables.$.orders": orderId }
      }
    );

    //remove from orders

    res = await db.collection("orders").updateOne(
      {
        profile, 'orders._id': orderId
      },
      {
        $pull: {
          orders: {
            _id: orderId
          }
        }
      }
    );

    //remove from order_status_history

    res = await db.collection("order_status_history").updateOne(
      {
        profile
      },
      {
        $pull: {
          order_change_status: {
            orderId
          }
        }
      }
    );

    return { ok: true, message: `Order ${orderId} deleted`, tableId};

  } catch (error) {
    console.error('Error removing order:', error);
    return { success: false, message: error.message };
  } finally {
    if (client) await client.close();
  }
}

export async function changeOrderStatusById(profile, orderId, status) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    const db = client.db(process.env.DB_NAME);

    //check if the order exist
    const order = await getOrderById(profile, orderId, ["_id"])
    if (!order) {
      return { ok: false, message: 'Order not found' }
    }

    // if it's already to the status do nothing
    const currentStatus = await getStatusByOrderId(profile, orderId)

    if (currentStatus._id === status) {
      return { ok: true, message: 'Status is already the same', same: true }
    }
    else if (currentStatus._id > status) {

      // Check if status after exist, if yes erase them
      const res = await db.collection('order_status_history').updateOne({
        profile,
        "order_change_status.orderId": orderId
      }, {
        $pull: {
          "order_change_status.$.status": {
            code: { $gt: status }
          }
        }
      });
      return { ok: true, message: 'Status updated successfully' }
    }

    // Ajouter les statuts manquants jusqu'au statut cible
    for (let code = currentStatus._id + 1; code <= status; code++) {
      const res = await addStatusHistory(profile, orderId, code)
      if (!res.ok) {
        return res
      }
    }
    return { ok: true, message: 'Status updated successfully' }
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

async function addStatusHistory(profile, orderId, status) {
  let client = null
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    const db = client.db(process.env.DB_NAME);
    const currentTime = new Date()

    const res = await db.collection('order_status_history').updateOne({
      profile,
      "order_change_status.orderId": orderId
    }, {
      $push: {
        "order_change_status.$.status": {
          code: status,
          time: currentTime
        }
      }
    });
    if (res.modifiedCount == 1) {
      return { ok: true, message: 'Status updated successfully' }
    }
    else {
      return { message: 'Failed to update status' }
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
