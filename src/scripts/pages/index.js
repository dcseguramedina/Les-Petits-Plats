import {
  listOfRecipes,
  listOfRecipeIngredients,
  listOfRecipeAppliances,
  listOfRecipeUstensils
} from '../utils/lists.utils.js';
import Recipe from '../models/Recipe.js';
import Search from '../models/Search.js';

// DISPLAY HOME PAGE //
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
    );
    recipe.displayRecipeCard();
  });

  displaySelectOptions(listOfRecipeIngredients, 'ingredients');
  displaySelectOptions(listOfRecipeAppliances, 'appliance');
  displaySelectOptions(listOfRecipeUstensils, 'ustensils');
};
displayHomePage()

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
};

// Manage open/close select dropdown //
const selectDropdown = document.querySelectorAll('.select_dropdown');

selectDropdown.forEach((select) => {
  select.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key === "Enter" || key === " ") {
      event.preventDefault();
      toggleDropdown(event.target);
    }
  });

  select.addEventListener('click', (event) => {
    const select = event.target;
    toggleDropdown(select);
  });
});

function toggleDropdown(select) {
  const selectId = select.id;
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
  };

  const dropdown = document.getElementById(dropdownId);
  dropdown.classList.toggle('show');
  select.style.borderRadius = dropdown.classList.contains('show') ? '10px 10px 0 0' : '10px';
};

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
    };

    filterOptions(inputId, dropdownId);
  });
});

// Manage filter options  //
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

      if (!options[i].getAttribute('data-eventlistener')) {
        options[i].addEventListener("click", (event) => {
          console.log("hello from optionInput")
          const selectedOptionInput = event.target;
          dropdown.classList.remove('show');
          const dropdownPrevious = dropdown.previousElementSibling;
          dropdownPrevious.style.borderRadius = dropdown.classList.contains('show') ? '10px 10px 0 0' : '10px';
          input.value = '';

          handleSelectSearch(selectedOptionInput.textContent, selectedOptionInput.closest('.dropdown_buttton'));
        });

        // On éviter de remettre l'eventListener à chaque tour de boucle
        options[i].setAttribute('data-eventlistener', true);
      }
    } else {
      options[i].style.display = 'none';
    };
  };
};

// MANAGE SEARCHBAR SEARCH OPTIONS //
// Define the array of available categories to search
const categories = ['title', 'ingredients', 'description'];

const inputElement = document.getElementById("search");
const searchBtnElement = document.getElementById("search_button");
const searchInstance = new Search(listOfRecipes, categories, inputElement);

inputElement.addEventListener('keydown', (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    if (inputElement.value.length < 3) {
      alert('Veuillez saisir au moins 3 caractères.');
      return;
    }
    searchInstance.handleSearch();
    updateSelectOptions();
  }
});

searchBtnElement.addEventListener('click', () => {
  if (inputElement.value.length < 3) {
    alert('Veuillez saisir au moins 3 caractères.');
    return;
  }

  searchInstance.handleSearch();
  updateSelectOptions();
});

// Update select options according to search results
function updateSelectOptions() {
  // Remove all existing options
  const optionsDropdown = document.querySelectorAll('option');
  optionsDropdown.forEach(option => option.remove());

  // Get visible recipe cards
  const visibleRecipeCards = Array.from(document.querySelectorAll('.recipe_card')).filter(card => {
    const style = window.getComputedStyle(card);
    return style.display !== 'none';
  });

  // Map visible recipe cards to recipe objects
  const displayedRecipes = visibleRecipeCards.map(card => ({
    id: card.getAttribute('data-id'),
    name: card.getAttribute('data-name'),
    description: card.getAttribute('data-description'),
    ingredients: card.getAttribute('data-ingredients').split(','),
    appliance: card.getAttribute('data-appliance'),
    ustensils: card.getAttribute('data-ustensils').split(',')
  }));

  // Get new lists for select options
  const listOfResultsIngredients = [...new Set(displayedRecipes.flatMap(recipe => recipe.ingredients))];
  const listOfResultsAppliances = [...new Set(displayedRecipes.map(recipe => recipe.appliance))];
  const listOfResultsUstensils = [...new Set(displayedRecipes.flatMap(recipe => recipe.ustensils))];

  // Display new options
  displaySelectOptions(listOfResultsIngredients, 'ingredients');
  displaySelectOptions(listOfResultsAppliances, 'appliance');
  displaySelectOptions(listOfResultsUstensils, 'ustensils');
}

// MANAGE SELECT SEARCH OPTIONS //
function handleSelectSearch(selectedOption, selectId) {
  const searchInput = document.getElementById('search');
  searchInput.value = selectedOption;

  // Define the array of available categories to search
  const categories = ['title', 'ingredients', 'description'];
  const searchInstance = new Search(listOfRecipes, categories, searchInput);

  searchInstance.handleSearch();
  updateSelectOptions();
}
