import { getIngredientById } from './db.js';

export default class Ingredient{
    static async getById(profile, ingredientId){
        return await getIngredientById(profile, ingredientId);
    }

}