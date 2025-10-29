import {
    addTableById, findAllTables, addOrderToTable, getOrdersOfTable,
    changeStatusInDB, getCustomersOfTableInDB, deleteInDB
    , getPriceOfTableInDB, payInDB,
    switchTablesInDB
} from './db.js';

export default class Table {
    static async allTables(profile) {
        return await findAllTables(profile);
    }

    static async getOrders(profile, tableId) {
        return await getOrdersOfTable(profile, tableId)
    }


    static async addTable(id) {
        return await addTableById(id)
    }

    static async order(profile, tableId, order) {
        return await addOrderToTable(profile, tableId, order)
    }
    static async getCustomers(tableId) {
        return await getCustomersOfTableInDB(tableId)
    }
    static async delete(tableId) {
        return await deleteInDB(tableId)
    }
    static async changeStatus(profile, tableId, statusId) {
        return await changeStatusInDB(profile, tableId, statusId)
    }

    static async getTotal(tableId) {
        return await getPriceOfTableInDB(tableId)
    }
    static async pay(tableId, tipValue) {
        return await payInDB(tableId, tipValue)
    }
    static async switch(tableId, tableId2) {
        return await switchTablesInDB(tableId, tableId2)
    }

}