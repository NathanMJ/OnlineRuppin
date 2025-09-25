import { changeOrderStatusById, getOrderById, removeOrderById,getPriceByOrderId, getOrdersFromDestinationInDB} from './db.js';

export default class Order {
    static async get(id) {
        return await getOrderById(id);
    } 
    static async removeOrder(id) {
        return await removeOrderById(id);
    }
    static async changeStatus(id, status) {
        return await changeOrderStatusById(id,status);
    }
    static async getPrice(id) {
        return await getPriceByOrderId(id);
    }

    static async fromDestination(destinationId){
        return await getOrdersFromDestinationInDB(destinationId)
    }

    
}