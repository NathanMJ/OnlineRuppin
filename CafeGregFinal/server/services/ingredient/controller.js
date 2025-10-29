import { log } from "node:console";
import Ingredient from "./model.js";

export async function getIngredient(req, res) {
    const { ingredientId, profile } = req.body
    let ingredient = await Ingredient.getById(profile, ingredientId);
    if (!ingredient) {
        return res.status(404).json({ message: "No ingredient found" });
    }
    return res.status(200).json({ ingredient, ok: true });
}


