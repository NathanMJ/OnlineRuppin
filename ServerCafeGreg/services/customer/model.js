import { findAllCustomers, findCustomer, addCustomer, cleanCustomers, modifyCustomer} from './db.js';

export default class Customer{
    constructor(id, contact) {
        this._id = id;
        this.contact = contact;
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

    static async cleanCustomers(){
        return await cleanCustomers()
    }

    static async modifyCustomer(customer){
        return await modifyCustomer(customer)
    }
}