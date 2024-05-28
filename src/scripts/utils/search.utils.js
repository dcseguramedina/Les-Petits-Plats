import {
    listOfAllRecipes,
} from '../utils/lists.utils.js'
import Recipe from '../models/Recipe.js'

// Manage Search Bar options //
document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search_button");

    // Add event listener to the search button
    searchBtn.addEventListener("click", handleSearchBar);
});

function handleSearchBar() {
    const searchInput = document.getElementById("search");

    // Check if the input is at least 3 characters long
    if (searchInput.value.length < 3) {
        console.log("Please enter at least 3 characters.");
        return;
    }

    // Convert the input to lowercase
    const lowercaseInput = searchInput.value.toLowerCase();

    const searchBy = ['title', 'ingredients', 'description'];

    let allMatches = []

    for (const category of searchBy) {
        const searchResult = searchRecipes(listOfAllRecipes, lowercaseInput, category);
        console.log(`Recipes by ${category}:`, searchResult);
        allMatches.push(searchResult);
    }

    const allMatchesList = allMatches.flat();
    console.log(allMatchesList)

    const listOfUniqueMatchs = [...new Set(allMatchesList)];
    console.log(listOfUniqueMatchs)

    // Clean the DOM
    let recipesSection = document.querySelector(".recipes_section")

    while (recipesSection.firstElementChild) {
        recipesSection.firstElementChild.remove();
    }

    // Update the DOM

    listOfUniqueMatchs.forEach(result => {
        const recipe = new Recipe(
            result.id,
            result.image,
            result.name,
            result.servings,
            result.ingredients,
            result.time,
            result.description,
            result.appliance,
            result.ustensils
        );
        recipe.displayRecipeCard();
    });
}

function searchRecipes(listOfAllRecipes, lowercaseInput, category) {
    // Filter the arrays to find matches
    return listOfAllRecipes.filter(recipe => {
        switch (category) {
            case 'title':
                return recipe.name.toLowerCase().includes(lowercaseInput);
            case 'ingredients':
                return recipe.ingredients.some(ingredient =>
                    ingredient.ingredient.toLowerCase().includes(lowercaseInput)
                );
            case 'description':
                return recipe.description.toLowerCase().includes(lowercaseInput);
            default:
                return false;
        }
    });
}
