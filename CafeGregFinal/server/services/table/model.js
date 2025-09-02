import { addTableById, findAllTables, findTableById, addOrderToTable, getOrdersOfTable, 
    changeStatusInDB, getCustomersOfTableInDB,deleteInDB
    ,getPriceOfTableInDB,payInDB} from './db.js';

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

    static async order(tableId, order) {
        return await addOrderToTable(tableId, order)
    }
    static async getOrders(tableId) {
        return await getOrdersOfTable(tableId)
    }
    static async getCustomers(tableId) {
        return await getCustomersOfTableInDB(tableId)
    }
    static async delete(tableId) {
        return await deleteInDB(tableId)
    }
    static async changeStatus(tableId, statusId) {
        return await changeStatusInDB(tableId,statusId)
    }

    static async getTotal(tableId) {
        return await getPriceOfTableInDB(tableId)
    }
    static async pay(tableId) {
        return await payInDB(tableId)
    }

    

}