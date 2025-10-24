import { changeProductInDB, findAllProducts, findProductById, findProductByName} from './db.js';

export default class Product{
    static async allProducts(){
        return await findAllProducts();
    }

    static async productById(productId, profile, details){
        return await findProductById(productId, profile, details)
    }

    static async productsByName(name){
        return await findProductByName(name)
    }
    static async changeProduct(newProduct){
        return await changeProductInDB(newProduct)
    }

    
}