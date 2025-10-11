import { changeProductInDB, findAllProducts, findProductById, findProductByName} from './db.js';

export default class Product{
    static async allProducts(){
        return await findAllProducts();
    }

    static async productById(id){
        return await findProductById(id)
    }

    static async productsByName(name){
        return await findProductByName(name)
    }
    static async changeProduct(newProduct){
        return await changeProductInDB(newProduct)
    }

    
}