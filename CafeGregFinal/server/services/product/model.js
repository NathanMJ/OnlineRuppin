import { changeProductInDB, findAllProducts, findProductById, findProductByName } from './db.js';

export default class Product {
    static async allProducts() {
        return await findAllProducts();
    }

    static async productById(profile, productId, detailsToKeep) {
        return await findProductById(profile, productId, detailsToKeep)
    }

    static async productsByName(profile, research) {
        return await findProductByName(profile, research)
    }
    static async changeProduct(newProduct) {
        return await changeProductInDB(newProduct)
    }


}