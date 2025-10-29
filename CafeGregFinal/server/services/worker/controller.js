import { error, log } from "console";
import Worker from "./model.js";

export async function getWorker(req, res) {
    const {workerId, profile} = req.body
    const worker = await Worker.getWorker(profile, workerId);
    if (!worker) {
        return res.status(404).json({ message: `Worker with id ${workerId} not found` });
    }
    return res.status(200).json({worker, ok: true});
}


export async function entry(req, res) {
    console.log('post entry');

    const { workerId, clickerId } = req.body
    let response = await Worker.entry(workerId, clickerId)
    if (!response.success) {
        return res.status(404).json({ message: response.message })
    }
    emitWorkerUpdate(req.io, workerId)
    emitEveryWorkerUpdate(req.io)
    return res.status(200).json({ ok: true, message: 'Entry confirmed'})
}

export async function pause(req, res) {
    const { workerId, clickerId } = req.body
    let response = await Worker.pause(workerId, clickerId)
    if (!response) {
        return res.status(404).json({ message: `Error with the pause of the worker : ${workerId}` })
    }
    emitWorkerUpdate(req.io, workerId)
    emitEveryWorkerUpdate(req.io)
    return res.status(200).json({ ok: true, message: 'Pause confirmed'})
}


export async function getEntries(req, res) {

    const { workerId } = req.body
    let entries = await Worker.getEntries(workerId)
    if (!entries) {
        return res.status(404).json({ message: `Error with the entries of the worker : ${workerId}` })
    }
    return res.status(200).json({ entries })
}

export async function getEveryEntriesWithWorkers(req, res) {
    let entriesWithWorkers = await Worker.getEveryEntriesWithWorkers()
    if (!entriesWithWorkers) {
        return res.status(404).json({ message: `Error with the entries of every workers` })
    }
    emitEveryWorkerUpdate(req.io)
    return res.status(200).json({ entriesWithWorkers })
}

export const emitWorkerUpdate = (io, workerId) => {
    //fetch all the tables and emit to cafe
    Worker.getEntries(workerId).then(data => {
        console.log('Emitting updated entries for worker:', workerId);
        io.to(`get-entries:${workerId}`).emit(`get-entries:updated`, {
            entries: data,
            workerId
        });
    }).catch(err => {
        console.error('Error fetching worker entries of', workerId, err);
    });
}

export const emitEveryWorkerUpdate = (io) => {
    //fetch all the tables and emit to cafe
    Worker.getEveryEntriesWithWorkers().then(data => {
        console.log('Emitting updated entries for every workers');
        io.to(`get-workers-entries`).emit(`manager:worker:updated`, {
            data
        });
    }).catch(err => {
        console.error('Error fetching every workers entries', err);
    });
}