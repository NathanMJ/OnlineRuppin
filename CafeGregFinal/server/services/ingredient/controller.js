import { log } from "node:console";
import Ingredient from "./model.js";

export async function getIngredient(req, res) {
    const id = Number(req.params.id)
    let ingredient = await Ingredient.get(id);
    if (!ingredient) {
        return res.status(404).json({ message: "No ingredient found" });
    }
    return res.status(200).json(ingredient);
}


