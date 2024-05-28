import {
    listOfAllRecipes,
    listOfRecipeTitles
} from '../utils/lists.utils.js'
import Recipe from '../models/Recipe.js'

// Manage Search Bar options //

document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search_button");

    // Add event listener to the search button
    searchBtn.addEventListener("click", handleSearch);
});

function handleSearch() {
    const searchInput = document.getElementById("search");

    // Check if the input is at least 3 characters long
    if (searchInput.value.length < 3) {
        console.log("Please enter at least 3 characters.");
        return;
    }

    // Convert the input to lowercase
    const searchTitle = searchInput.value.toLowerCase();

    // Filter the titles array to find matches
    const recipesTitles = Array.from(listOfRecipeTitles)

    const matchesTitles = recipesTitles.filter(title =>
        title.toLowerCase().includes(searchTitle)
    );
    console.log(matchesTitles)

    // If no matches are found, log a message
    if (matchesTitles.length === 0) {
        console.log(`No titles found containing "${searchInput.value}".`);
        return;
    }

    // Clean the DOM
    let recipesSection = document.querySelector(".recipes_section")

    while (recipesSection.firstElementChild) {
        recipesSection.firstElementChild.remove();
    }

    // Update the DOM
    const searchResult = listOfAllRecipes.filter(recipe =>
        matchesTitles.includes(recipe.name)
    );

    searchResult.forEach(result => {
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
