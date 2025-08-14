import {  getStatusByOrderId} from './db.js';

export default class Status {
    static async orderId(id) {
        return await getStatusByOrderId(id)
    }

}