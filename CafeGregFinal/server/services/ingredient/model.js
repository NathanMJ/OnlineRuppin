import { getIngredientById } from './db.js';

export default class Ingredient{
    static async get(id){
        return await getIngredientById(id);
    }

}