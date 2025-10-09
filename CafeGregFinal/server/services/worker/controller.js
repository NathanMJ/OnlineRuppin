import { error, log } from "console";
import Worker from "./model.js";

export async function getWorker(req, res) {
    const id = req.params.id
    let worker = await Worker.getWorker(id);
    if (!worker) {
        return res.status(404).json({ message: "No worker found" });
    }
    return res.status(200).json(worker);
}


export async function entry(req, res) {
    const { workerId, clickerId } = req.body
    let response = await Worker.entry(workerId, clickerId)
    if (!response) {
        return res.status(404).json({ message: `Error with the entry of the worker : ${workerId}` })
    }
    emitWorkerUpdate(req.io, workerId)
    return res.status(200)
}

export async function pause(req, res) {
    const { workerId, clickerId } = req.body
    let response = await Worker.pause(workerId, clickerId)
    if (!response) {
        return res.status(404).json({ message: `Error with the pause of the worker : ${workerId}` })
    }
    emitWorkerUpdate(req.io, workerId)
    return res.status(200)
}


export async function getEntries(req, res) {

    const { workerId } = req.body
    let entries = await Worker.getEntries(workerId)
    if (!entries) {
        return res.status(404).json({ message: `Error with the entries of the worker : ${workerId}` })
    }
    return res.status(200).json({ entries })
}


export const emitWorkerUpdate = (io, workerId) => {
    //fetch all the tables and emit to cafe
    Worker.getEntries(workerId).then(data => {
        console.log('Emitting updated entries for worker:', workerId);
        io.to(`get-entries:${workerId}`).emit(`get-entries:updated`, {
            entries:data,
            workerId
        });
    }).catch(err => {
        console.error('Error fetching cafe tables', err);
    });
}