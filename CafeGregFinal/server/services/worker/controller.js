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


export async function entry(req, res){    
    const { workerId, clickerId } = req.body
    let response = Worker.entry(workerId, clickerId)
    if(!response){
        return res.status(404).json({message: `Error with the entry of the worker : ${workerId}`})
    }
    //TODO: update the page of the connections
    return res.status(200)
}

export async function getEntries(req, res){
   
    const { workerId } = req.body
    let entries = Worker.getEntries(workerId)
    if(!entries){
        return res.status(404).json({message: `Error with the entries of the worker : ${workerId}`})
    }
    //TODO: update the page of the connections
    return res.status(200).json({entries})
}