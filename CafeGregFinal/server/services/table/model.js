import { addTableById, findAllTables, findTableById, addOrderToTable, getOrdersOfTable} from './db.js';

export default class Table {
    static async allTables() {
        return await findAllTables();
    }

    static async tableById(id) {
        return await findTableById(id)
    }
    static async addTable(id) {
        return await addTableById(id)
    }

    static async order(tableId, order){
        return await addOrderToTable(tableId, order)
    }
    static async getOrders(tableId){
        return await getOrdersOfTable(tableId)
    }
}