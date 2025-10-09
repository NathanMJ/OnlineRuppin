import {
    entryWorker,
    getWorkerFromDB,
    getEntriesFromDB
} from './db.js';

export default class Worker {
    static async getWorker(id) {
        return await getWorkerFromDB(id);
    }

    static async entry(id, clickerId){
        return await entryWorker(id, clickerId)
    }

    static async getEntries(workerId){
        return await getEntriesFromDB(workerId)
    }

}