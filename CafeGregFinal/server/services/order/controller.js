import { log } from "node:console";
import Order from "./model.js";

export async function getOrder(req, res) {
    const id = Number(req.params.id)
    let order = await Order.get(id);
    if (!order) {
        return res.status(404).json({ message: "No order were found" });
    }
    return res.status(200).json(order);
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
    const id = Number(req.params.id)
    let response = await Order.removeOrder(id);
    return res.status(200).json(response);
}

export async function changeStatus(req, res) {
    const id = Number(req.params.id)
    const status = Number(req.params.status)
    let response = await Order.changeStatus(id, status);
    return res.status(200).json(response);
}


export async function getOrdersFromDestination(req, res){
    const destinationId = Number(req.params.destination)
    const orders = await Order.fromDestination(destinationId)
    return res.status(200).json(orders)
}



