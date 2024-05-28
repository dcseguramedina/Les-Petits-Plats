import {
  listOfRecipes,
  listOfRecipeIngredients,
  listOfRecipeAppliances,
  listOfRecipeUstensils
} from '../utils/lists.utils.js'
import Recipe from '../models/Recipe.js'

let listOfFilteredRecipes = []

// Display Home page //
function displayHomePage() {
  listOfRecipes.forEach((item) => {
    const recipe = new Recipe(
      item.id,
      item.image,
      item.name,
      item.servings,
      item.ingredients,
      item.time,
      item.description,
      item.appliance,
      item.ustensils
    )
    recipe.displayRecipeCard()
  });

  displaySelectOptions(listOfRecipeIngredients, 'ingredients');
  displaySelectOptions(listOfRecipeAppliances, 'appliance');
  displaySelectOptions(listOfRecipeUstensils, 'ustensils');
}
displayHomePage()

// Manage Search Bar options //

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("search_button");

  // Add event listener to the search field
  searchInput.addEventListener("keydown", (event) => {
    let key = event.key
    if (key === "Enter") {
      handleSearchBar();
    }
  });

  // Add event listener to the search button
  searchBtn.addEventListener("click", handleSearchBar);
});

function handleSearchBar() {
  const searchInput = document.getElementById("search");

  // Check if the input is at least 3 characters long
  if (searchInput.value.length < 3) {
    alert(`Veuillez saisir au moins 3 caractères.`);
    return;
  }

  // Convert the input to lowercase
  const lowercaseInput = searchInput.value.toLowerCase();
  const searchBy = ['title', 'ingredients', 'description'];
  let allMatches = []

  for (const category of searchBy) {
    const searchResult = searchRecipes(listOfRecipes, lowercaseInput, category);
    allMatches.push(searchResult);
  }

  const allMatchesList = allMatches.flat();
  console.log(allMatchesList)

  listOfFilteredRecipes = [...new Set(allMatchesList)];
  console.log(listOfFilteredRecipes)

  if (listOfFilteredRecipes.length === 0) {
    alert(`Aucune recette ne contient "${lowercaseInput}" vous pouvez chercher «tarte aux pommes », « poisson », etc.`);
    return
  }

  cleanSelectOptions()
  cleanRecipesGallery()
  updateSelectAndRecipes(listOfFilteredRecipes)
  updateRecipesNumber(listOfFilteredRecipes)
  createTag(searchInput)
}

function searchRecipes(listOfRecipes, lowercaseInput, category) {
  // Filter the arrays to find matches
  return listOfRecipes.filter(recipe => {
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
        return;
    }
  });
}

// Display select options on Home page //

function displaySelectOptions(listOfOptions, selectId) {
  const select = document.getElementById(selectId);
  const listOfUniqueOptions = [...new Set(listOfOptions)];

  listOfUniqueOptions.forEach((item) => {
    const option = document.createElement('option');
    option.className = 'content';
    option.textContent = item;
    select.appendChild(option);
  });
}

// Manage open/close select dropdown //
const selectDropdown = document.querySelectorAll('.select_dropdown');

selectDropdown.forEach((select) => {
  // Add event listener on keydown
  select.addEventListener('keydown', (event) => {
    const select = event.target;

    let key = event.key
    if (key === "Enter") {
      toggleDropdown(select);
    }
  });
  // Add event listener on click
  select.addEventListener('click', (event) => {
    const select = event.target;
    console.log(select)
    toggleDropdown(select);
  });
});

function toggleDropdown(select) {
  const selectId = select.id
  console.log(selectId)
  let dropdownId;

  switch (selectId) {
    case 'ingredients_btn':
      dropdownId = 'ingredients';
      break;
    case 'appliance_btn':
      dropdownId = 'appliance';
      break;
    case 'ustensils_btn':
      dropdownId = 'ustensils';
      break;
    default:
      return;
  }

  const dropdown = document.getElementById(dropdownId);
  console.log(dropdown)
  dropdown.classList.toggle('show');
  select.style.borderRadius = dropdown.classList.contains('show') ? '10px 10px 0 0' : '10px';
}


// Filter options on select dropdown //
const selectOptionsInput = document.querySelectorAll('.input');

selectOptionsInput.forEach((input) => {
  input.addEventListener('keyup', (event) => {
    const inputId = event.target.id;
    let dropdownId;

    switch (inputId) {
      case 'ingredients_input':
        dropdownId = 'ingredients';
        break;
      case 'appliance_input':
        dropdownId = 'appliance';
        break;
      case 'ustensils_input':
        dropdownId = 'ustensils';
        break;
      default:
        console.error('error');
    }

    filterOptions(inputId, dropdownId);
  });
});



function filterOptions(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const filter = input.value.toLowerCase();
  const dropdown = document.getElementById(dropdownId);
  const options = dropdown.getElementsByTagName('option');

  // Filter the options and add event listeners to the visible ones
  for (let i = 0; i < options.length; i++) {
    const searchInput = options[i].textContent || options[i].innerText;

    if (searchInput.toLowerCase().indexOf(filter) > -1) {
      options[i].style.display = '';
      dropdown.style.height = 'auto';
      // Add event listener on keydown
      options[i].addEventListener("keydown", (event) => {
        const select = event.target;
        let key = event.key
        if (key === "Enter") {
          handleSearchFromSelect(event, dropdownId);
          const dropdown = document.getElementById(dropdownId);
          console.log(dropdown)
          dropdown.classList.remove('show');
          // Needs to manage the border radius on close

        }

      });
      // Add event listener on click
      options[i].addEventListener("click", (event) => {
        const select = event.target;
        handleSearchFromSelect(event, dropdownId);
        const dropdown = document.getElementById(dropdownId);
        console.log(dropdown)
        dropdown.classList.remove('show');
        // Needs to manage the border radius on close
      });
    } else {
      options[i].style.display = 'none';
    }
  }
}

// Handle search on select dropdown //
function handleSearchFromSelect(event, dropdownId) {
  const galleryElements = document.querySelector('.recipes_section');
  const recipeCards = galleryElements.querySelectorAll('article')

  let searchInput = event.target;
  let searchValue = event.target.textContent;
  let allMatches = [];

  if (recipeCards.length === 50) {
    const filteredRecipes = listOfRecipes.filter(recipe => {
      if (dropdownId === 'ingredients') {
        return recipe.ingredients.some(ingredient =>
          ingredient.ingredient.includes(searchValue)
        );
      } else if (dropdownId === 'appliance') {
        return recipe.appliance.includes(searchValue);
      } else if (dropdownId === 'ustensils') {
        return recipe.ustensils.some(ustensil =>
          ustensil.includes(searchValue)
        );
      }
    });

    allMatches.push(filteredRecipes);
  } else {
    const filteredRecipes = listOfFilteredRecipes.filter(recipe => {
      if (dropdownId === 'ingredients') {
        return recipe.ingredients.some(ingredient =>
          ingredient.ingredient.includes(searchValue)
        );
      } else if (dropdownId === 'appliance') {
        return recipe.appliance.includes(searchValue);
      } else if (dropdownId === 'ustensils') {
        return recipe.ustensils.some(ustensil =>
          ustensil.includes(searchValue)
        );
      }
    });

    allMatches.push(filteredRecipes);
  }

  const allMatchesList = allMatches.flat();
  console.log(allMatchesList);

  const listOfSelectFilteredRecipes = [...new Set(allMatchesList)];
  console.log(listOfSelectFilteredRecipes);

  cleanSelectOptions()
  cleanRecipesGallery()
  updateSelectAndRecipes(listOfSelectFilteredRecipes)
  updateRecipesNumber(listOfSelectFilteredRecipes)
  createTag(searchInput)
}

function cleanSelectOptions() {
  const optionsDropdown = document.getElementsByTagName('option');
  // Remove all existing options
  while (optionsDropdown.length > 0) {
    optionsDropdown[0].parentNode.removeChild(optionsDropdown[0]);
  }
}

function cleanRecipesGallery() {
  const recipesSection = document.querySelector(".recipes_section");

  while (recipesSection.firstElementChild) {
    recipesSection.firstElementChild.remove();
  }
}

function updateSelectAndRecipes(newListOfRecipes) {
  const listOfAllFilteredIngredients = []
  let listOfFilteredIngredients
  const listOfAllFilteredAppliances = []
  let listOfFilteredAppliances = []
  const listOfAllFilteredUstensils = []
  let listOfFilteredUstensils = []

  newListOfRecipes.forEach(result => {
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
    listOfAllFilteredIngredients.push(result.ingredients)
    listOfFilteredIngredients = listOfAllFilteredIngredients.flatMap((ingredients) => ingredients.map((ingredient) => ingredient.ingredient));
    listOfAllFilteredAppliances.push(result.appliance)
    listOfFilteredAppliances = listOfAllFilteredAppliances.flatMap((appliances) => appliances);
    listOfAllFilteredUstensils.push(result.ustensils)
    listOfFilteredUstensils = listOfAllFilteredUstensils.flatMap((ustensils) => ustensils);

    recipe.displayRecipeCard();
  });

  displaySelectOptions(listOfFilteredIngredients, 'ingredients');
  displaySelectOptions(listOfFilteredAppliances, 'appliance');
  displaySelectOptions(listOfFilteredUstensils, 'ustensils');
}

function updateRecipesNumber(newListOfRecipes) {
  const recipesNumber = document.getElementById('recipes_number');
  let number = newListOfRecipes.length
  recipesNumber.textContent = `${number} recettes`;

}

function createTag(searchInput) {
  let keyword = searchInput.value.trim();

  if (keyword !== '') {
    const tagSection = document.getElementById('tag_section');

    const tagElement = document.createElement('div');
    tagElement.classList.add('tag');
    tagSection.appendChild(tagElement);

    const keywordElement = document.createElement('span');
    keywordElement.classList.add('keyword');
    keywordElement.textContent = keyword;
    tagElement.appendChild(keywordElement);

    const closeElement = document.createElement('button');
    closeElement.classList.add('close');
    closeElement.type = 'button';
    closeElement.textContent = 'x';
    tagElement.appendChild(closeElement);

    searchInput.value = '';
  }
}

// Launch close tags
const tags = document.querySelectorAll('.tag');
const closeButtons = document.querySelectorAll('.close');

closeButtons.forEach((closeButton) => {
  closeButton.addEventListener("click", closeTag);
});

// Close tags
function closeTag(event) {
  const tag = event.target.closest('.tag');
  tag.style.display = "none";
}

