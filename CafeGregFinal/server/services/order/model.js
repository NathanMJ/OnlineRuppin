import { changeOrderStatusById, getOrderById, removeOrderById,getPriceByOrderId, getOrdersFromDestinationInDB} from './db.js';

export default class Order {
    static async getById(profile, orderId, fullDetail = false) {
        return await getOrderById(profile, orderId, fullDetail);
    } 
    static async removeOrder(profile, orderId) {
        return await removeOrderById(profile, Number(orderId));
    }
    static async changeStatus(profile, orderId, status) {
        return await changeOrderStatusById(profile, orderId, status);
    }
    static async getPrice(id) {
        return await getPriceByOrderId(id);
    }

    static async fromDestination(destinationId){
        return await getOrdersFromDestinationInDB(destinationId)
    }

    
}