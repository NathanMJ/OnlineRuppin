import { log } from "node:console";
import Product from "./model.js";

export async function getAllProducts(req, res) {

    let products = await Product.allProducts();

    if (!products) {
        return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(products);
}


export async function getProduct(req, res) {
    
    
    let product = await Product.productById(Number(req.params.id));

    if (!product) {
        return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(product);
}
