import { getStatusByOrderId, getEveryStatusFromDB } from './db.js';

export default class Status {
    static async byOrderId(profile, orderId) {
        return await getStatusByOrderId(profile, orderId)
    }
    static async getEveryStatus() {
        return await getEveryStatusFromDB()
    }

}