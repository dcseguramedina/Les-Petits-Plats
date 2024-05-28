import recipes from '../../data/recipes.js'

const listOfRecipes = recipes.recipes;

const listOfRecipeTitles = listOfRecipes.map((recipe) => recipe.name);
const listOfRecipeDescriptions = listOfRecipes.map((recipe) => recipe.description);
const listOfRecipeIngredients = listOfRecipes.flatMap((recipe) => recipe.ingredients.map((ingredient) => ingredient.ingredient));
const listOfRecipeAppliances = listOfRecipes.map((recipe) => recipe.appliance);
const listOfRecipeUstensils = listOfRecipes.flatMap((recipe) => recipe.ustensils);

export {
    listOfRecipes,
    listOfRecipeTitles,
    listOfRecipeDescriptions,
    listOfRecipeIngredients,
    listOfRecipeAppliances,
    listOfRecipeUstensils
};
