import { findAllProducts, findProductById} from './db.js';

export default class Customer{
    static async allProducts(){
        return await findAllProducts();
    }

    static async productById(id){
        return await findProductById(id)
    }
}