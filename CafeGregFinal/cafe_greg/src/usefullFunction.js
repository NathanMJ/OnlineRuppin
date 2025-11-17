//capitalize

export const capitalFirstLetter = (word) => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};
//get the changes of an orders

//filter the ingredients with the changes
export const filterIngredientsOfChanges = (ingredients = [], changes = []) => {    
    const newIngredients = ingredients.filter(i => !changes.find(c => c.ingredientId == i._id))
    return newIngredients
}