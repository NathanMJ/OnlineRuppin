import { error } from "console";
import Table from "./model.js";

export async function getAllTables(req, res) {
    let tables = await Table.allTables();
    if (!tables) {
        return res.status(404).json({ message: "No tables found" });
    }
    return res.status(200).json(tables);
}


export async function getTable(req, res) {
    let table = await Table.tableById(Number(req.params.id));
    if (!table) {
        return res.status(404).json({ message: "No table found" });
    }
    return res.status(200).json(table);
}

export async function addTable(req, res) {
    let table = await Table.addTable(Number(req.params.id));

    return res.status(200).json(table);
}

export async function addOrder(req, res) {
    const tableId = req.params.id
    const order = req.body.order
    console.log('Adding order to table:', tableId, order);

    const tableUpdated = await Table.order(tableId, order)

    return res.status(200).json(tableUpdated);
}

export async function getOrders(req, res) {
    const tableId = req.params.id
    const orders = await Table.getOrders(tableId)
    return res.status(200).json(orders)
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

export async function changeStatus(req, res) {
    const tableId = Number(req.params.id)
    const statusId = Number(req.params.statusId)    
    const response = await Table.changeStatus(tableId,statusId)
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



export async function switchTables(req, res){
    const tableId = Number(req.params.id)
    const tableId2 = Number(req.params.id2)
    const response = await Table.switch(tableId, tableId2)
    emitCafeTableUpdate(req.io);
    return res.status(200).json(response)
}



export const emitTableOrdersUpdate = (io, tableId) => {
    //fetch the order for the table and emit to table
    Table.getOrders(tableId).then(data => {
        console.log('Emitting updated orders for table:', tableId);
        io.to(`table:${tableId}`).emit('table:orders:updated', {
            tableId,
            orders:data.orders || []
        });
    }).catch(err => {
        console.error('Error fetching orders for table:', tableId, err);
    });
};


export const emitCafeTableUpdate = (io) => {
    //fetch all the tables and emit to cafe
    Table.allTables().then(data => {
        console.log('Emitting updated cafe tables');
        io.to('cafe-tables').emit('cafe-tables:update', {
            tables:data || []
        });
    }).catch(err => {
        console.error('Error fetching cafe tables', err);
    });
}