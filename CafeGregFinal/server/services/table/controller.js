import { response } from "express";
import Table from "./model.js";

export async function getAllTables(req, res) {
    const { profile } = req.body
    let tables = await Table.allTables(profile);
    if (!tables) {
        return res.status(404).json({ message: "Error in research of tables" });
    }
    return res.status(200).json({tables, ok: true});
}




export async function getOrders(req, res) {
    const { tableId, profile } = req.body
    const orders = await Table.getOrders(profile, tableId)
    if (!orders) {
        return res.status(404).json({ message: "Error in finding the orders" })
    }
    return res.status(200).json({ orders, ok: true })
}




export async function addTable(req, res) {
    let table = await Table.addTable(Number(req.params.id));
    return res.status(200).json(table);
}

export async function addOrder(req, res) {
    const { profile, order, tableId } = req.body
    const orderAdded = await Table.order(profile, tableId, order)
    if (!orderAdded) {
        res.status(404).json({ message: "Problem in addition of the order" })
    }
    emitTableOrdersUpdate(req.io, profile, tableId);
    return res.status(200).json({ orderAdded, ok: true });
}



export async function changeStatus(req, res) {
    const {tableId, profile, statusId} = req.body
    const response = await Table.changeStatus(profile, tableId, statusId)
    if(!response.ok){
        return res.status(404).json({message: response.message})
    }
    emitCafeTableUpdate(req.io, profile);
    console.log('changestatus');
    
    return res.status(200).json(response)
}


export async function getCustomersOfTable(req, res) {
    const tableId = Number(req.params.id)
    const customers = await Table.getCustomers(tableId)
    return res.status(200).json(customers)
}

export async function removeTable(req, res) {
    const tableId = Number(req.params.id)
    const response = await Table.delete(tableId)
    emitCafeTableUpdate(req.io);
    return res.status(200).json(response)
}
export async function getPriceOfTable(req, res) {
    const tableId = Number(req.params.id)
    const response = await Table.getTotal(tableId)
    return res.status(200).json(response)
}

export async function payTable(req, res) {
    const tableId = Number(req.params.id)
    const tipValue = Number(req.params.tipValue)
    const response = await Table.pay(tableId, tipValue)
    emitCafeTableUpdate(req.io);
    return res.status(200).json(response)
}


export async function switchTables(req, res) {
    const tableId = Number(req.params.id)
    const tableId2 = Number(req.params.id2)
    const response = await Table.switch(tableId, tableId2)
    emitCafeTableUpdate(req.io);
    return res.status(200).json(response)
}



export const emitTableOrdersUpdate = (io, profile, tableId) => {
    //fetch the order for the table and emit to table
    console.log('emit changes to table', tableId);

    Table.getOrders(profile, tableId).then(orders => {
        io.to(`profile:${profile}:table:${tableId}`).emit('table:orders:updated', {
            orders: orders || []
        });
    }).catch(err => {
        console.error('Error fetching orders for table:', tableId, err);
    });
};


export const emitCafeTableUpdate = (io, profile) => {
    //fetch all the tables and emit to cafe
    Table.allTables(profile).then(data => {
        console.log('Emitting updated tables');
        io.to(`main-tables:${profile}`).emit('main-tables:update', {
            tables: data || []
        });
    }).catch(err => {
        console.error('Error fetching cafe tables', err);
    });
}