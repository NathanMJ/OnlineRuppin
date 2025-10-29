import Status from "./model.js";

export async function getStatusOfOrder(req, res) {
    const { orderId, profile } = req.body
    const status = await Status.byOrderId(profile, orderId);
    if (!status) {
        return res.status(404).json({ message: `Error in status of order : ${orderId}` });
    }
    return res.status(200).json({ status, ok: true });
}

export async function getEveryStatus(req, res) {
    const response = await Status.getEveryStatus();
    if (!response.ok) {
        return res.status(404).json(response);
    }
    return res.status(200).json(response);
}


