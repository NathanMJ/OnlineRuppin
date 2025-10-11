import {  getStatusByOrderId,getEveryStatusFromDB} from './db.js';

export default class Status {
    static async orderId(id) {
        return await getStatusByOrderId(id)
    }
    static async getEveryStatus() {
        return await getEveryStatusFromDB()
    }

}