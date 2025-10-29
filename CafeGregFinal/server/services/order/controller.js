import { emitCafeTableUpdate, emitTableOrdersUpdate } from "../table/controller.js";
import Order from "./model.js";

export async function getOrder(req, res) {
    const { orderId, profile } = req.body
    let order = await Order.getById(profile, orderId);
    if (!order) {
        return res.status(404).json({ message: "No order were found" });
    }
    return res.status(200).json({ order, ok: true });
}

export async function getOrderPrice(req, res) {
    const id = Number(req.params.id)
    let price = await Order.getPrice(id);
    if (!price) {
        return res.status(404).json({ message: "No order was found" });
    }
    return res.status(200).json(price);
}

export async function removeOrder(req, res) {
    const { orderId, profile } = req.body
    let response = await Order.removeOrder(profile, orderId);
    if (!response.ok) {
        return res.status(404).json({ message: response.message })
    }
    emitTableOrdersUpdate(req.io, profile, response.tableId);
    return res.status(200).json(response);
}


export async function changeStatus(req, res) {
    const { orderId, status, tableId, destinationId, profile } = req.body
    console.log(req.body);
    
    let response = await Order.changeStatus(profile, orderId, status);
    if (!response.ok) {
        return res.status(404).json({ message: response.message })
    }
    if (!response.same) {
        emitTableOrdersUpdate(req.io, profile, tableId);
        emitCafeTableUpdate(req.io, profile);
        //emitDestinationOrderUpdate(req.io, destinationId);
    }
    return res.status(200).json(response);
}

export async function getOrdersFromDestination(req, res) {
    const destinationId = Number(req.params.destination)
    const orders = await Order.fromDestination(destinationId)
    return res.status(200).json(orders)
}


export const emitDestinationOrderUpdate = (io, destinationId) => {
    //fetch the order of the destination and fetch the orders
    Order.fromDestination(destinationId).then(data => {
        console.log('Emitting updated orders for destination:', destinationId);
        io.to(`preparationRoom:${destinationId}`).emit('preparationRoom:update', {
            orders: data.orders || []
        });
    }).catch(err => {
        console.error('Error fetching orders for table:', tableId, err);
    });
};

