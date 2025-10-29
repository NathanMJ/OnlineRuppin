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
    const { productId, profile, detailsToKeep } = req.body

    let product = await Product.productById(profile, productId, detailsToKeep);
    if (!product) {
        return res.status(404).json({ message: response.message });
    }
    return res.status(200).json({ product, ok: true });
}

export async function getProductsByName(req, res) {

    const { research, profile } = req.body
    console.log({ research, profile });
    let products = await Product.productsByName(profile, research);
    if (!products) {
        return res.status(404).json({ message: "No products found" });
    }
    console.log(products);

    return res.status(200).json({ products, ok: true });
}

export async function changeProduct(req, res) {
    const { newProduct } = req.body

    let response = await Product.changeProduct(newProduct)
    if (!response.ok) {
        return res.status(404).json({ message: response.message })
    }
    return res.status(200).json({ ok: true, message: response.message })
}