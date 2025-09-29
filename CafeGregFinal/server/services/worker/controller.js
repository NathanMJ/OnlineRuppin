import { error, log } from "console";
import Worker from "./model.js";

export async function getWorker(req, res) {
    const id = req.params.id
    let worker = await Worker.getWorker(id);
    console.log(worker);
    
    if (!worker) {
        return res.status(404).json({ message: "No worker found" });
    }
    return res.status(200).json(worker);
}

