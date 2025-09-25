import {
    getWorkerFromDB
} from './db.js';

export default class Worker {
    static async getWorker(id) {
        return await getWorkerFromDB(id);
    }

}