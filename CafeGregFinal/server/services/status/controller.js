import Status from "./model.js";

export async function getStatusOfOrder(req, res) {
    const id = req.params.orderId
    const response = await Status.orderId(id);
    if (!response) {
        return res.status(404).json(response);
    }
    return res.status(200).json(response);
}

