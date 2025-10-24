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
    const { productId, profile, details = [] } = req.body
   
    let response = await Product.productById(productId, profile, details);
    if (!response.ok) {
        return res.status(404).json({ message: response.message });
    }
    return res.status(200).json(response);
}

export async function getProductsByName(req, res) {
    const research = req.params.research
    let product = await Product.productsByName(research);
    if (!product) {
        return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(product);
}

export async function changeProduct(req, res) {
    const { newProduct } = req.body

    let response = await Product.changeProduct(newProduct)
    if (!response.ok) {
        return res.status(404).json({ message: response.message })
    }
    return res.status(200).json({ ok: true, message: response.message })
}