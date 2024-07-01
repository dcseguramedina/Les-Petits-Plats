import {
  listOfRecipes,
  listOfRecipeIngredients,
  listOfRecipeAppliances,
  listOfRecipeUstensils
} from '../utils/lists.utils.js'
import Recipe from '../models/Recipe.js'
import Search from '../models/Search.js'

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
    )
    recipe.displayRecipeCard()
  });

  displaySelectOptions(listOfRecipeIngredients, 'ingredients');
  displaySelectOptions(listOfRecipeAppliances, 'appliance');
  displaySelectOptions(listOfRecipeUstensils, 'ustensils');
}
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


// MANAGE FILTER AND SELECT SEARCH OPTIONS //

function filterOptions(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const filter = input.value.toLowerCase();
  const dropdown = document.getElementById(dropdownId);
  const options = dropdown.getElementsByTagName('option');

  // Create searchInstance
  const searchInstance = new Search(listOfRecipes, input);

  // Filter the options and add event listeners to the visible ones
  for (let i = 0; i < options.length; i++) {
    const searchInput = options[i].textContent || options[i].innerText;

    if (searchInput.toLowerCase().indexOf(filter) > -1) {
      options[i].style.display = '';
      dropdown.style.height = 'auto';

      // Add event listener on keydown
      options[i].addEventListener("keydown", (event) => { // No working ///////////////
        if (event.key === "Enter") {
          handleSearchFromOptions(searchInstance, event, dropdown);
        }
      });

      // Add event listener on click
      options[i].addEventListener("click", (event) => {
        handleSearchFromOptions(searchInstance, event, dropdown);
      });
    } else {
      options[i].style.display = 'none';
    }
  }
}

function handleSearchFromOptions(searchInstance, event, dropdown) {
  const selectInput = event.target.firstChild;
  console.log(selectInput);
  searchInstance.input = selectInput;
  searchInstance.handleSearchFromSelect();
  dropdown.classList.remove('show');
  // TODO: Manage the border radius on close
  // updateSelectOptions();
}


// MANAGE SEARCHBAR SEARCH OPTIONS //

const inputElement = document.getElementById("search");
const searchBtnElement = document.getElementById("search_button");
const searchInstance = new Search(listOfRecipes, inputElement);

// Add an event listener to handle the search
inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchInstance.handleSearchFromSearchBar();
    // updateSelectOptions();
  }
});
searchBtnElement.addEventListener('click', () => searchInstance.handleSearchFromSearchBar());

// // Update select options according to search results
// function updateSelectOptions() {
//   // Remove all existing options
//   const optionsDropdown = document.getElementsByTagName('option');

//   while (optionsDropdown.length > 0) {
//     optionsDropdown[0].parentNode.removeChild(optionsDropdown[0]);
//   }

//   // Display new options
//   const searchHistory = searchInstance.getSearchResults();
//   console.log(searchHistory)

//   let listOfResultIngredients = new Set(
//     searchHistory.flatMap((result) =>
//       result.map(ingredients => ingredients.ingredient)
//     )
//   );
//   console.log(listOfResultIngredients)

//   let listOfResultAppliances = new Set(
//     searchHistory.map((result) => result.map((appliance) => appliance))
//   );
//   console.log(listOfResultAppliances)

//   let listOfResultUstensils = new Set(
//     searchHistory.flatMap((result) => result.map((ustensils) => ustensils))
//   );
//   console.log(listOfResultUstensils)

//   displaySelectOptions(listOfResultIngredients, 'ingredients');
//   displaySelectOptions(listOfResultAppliances, 'appliance');
//   displaySelectOptions(listOfResultUstensils, 'ustensils');
// }
