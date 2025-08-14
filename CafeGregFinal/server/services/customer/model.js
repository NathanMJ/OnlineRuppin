import { findAllCustomers, findCustomer, addCustomer,  modifyCustomer, registerInDB} from './db.js';

export default class Customer{
    constructor(id, contact, name) {
        this._id = id;
        this.contact = contact;
        this.name = name;
    }

    static async allCustomer(){
        return await findAllCustomers();
    }

    static async findCustomer(id){
        return await findCustomer(id);
    }

    static async addCustomer(customer){
        return await addCustomer(customer);
    }


    static async modifyCustomer(customer){
        return await modifyCustomer(customer)
    }

    static async register(tableId, customer){
        return await registerInDB(tableId, customer)
    }
}