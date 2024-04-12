import recipes from '../../data/recipes.js'
import Recipe from '../models/Recipe.js'

function displayHomePage() {

  let listOfAllIngredients = []
  let listOfAllAppliances = []
  let listOfAllUstensils = []

  recipes.recipes.forEach((item) => {
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

    const ingredients = item.ingredients
    ingredients.forEach((item) => {
      listOfAllIngredients.push(item.ingredient)
    })

    listOfAllAppliances.push(item.appliance)

    const ustensils = item.ustensils
    ustensils.forEach((item) => {
      listOfAllUstensils.push(item)
    })
  });
  displaySelectIngredients(listOfAllIngredients)
  displaySelectAppliances(listOfAllAppliances)
  displaySelectUstensils(listOfAllUstensils)
}
displayHomePage()

// Display select //

function displaySelectIngredients(listOfAllIngredients) {
  const ingredientsSelect = document.getElementById('ingredients')

  const listOfIngredients = listOfAllIngredients.filter((item, index) => listOfAllIngredients.indexOf(item) === index)
  console.log(listOfIngredients)

  listOfIngredients.forEach((item) => {
    // Create an "option" tag for each select ingredient option
    const selectIngredientOption = document.createElement('option')
    selectIngredientOption.className = 'content'
    selectIngredientOption.textContent = item
    ingredientsSelect.appendChild(selectIngredientOption)
  })
}

function displaySelectAppliances(listOfAllAppliances) {
  const applianceSelect = document.getElementById('appliance')

  const listOfAppliances = listOfAllAppliances.filter((item, index) => listOfAllAppliances.indexOf(item) === index)
  console.log(listOfAppliances)

  listOfAppliances.forEach((item) => {
    // Create an "option" tag for each select appliance option
    const selectApplianceOption = document.createElement('option')
    selectApplianceOption.className = 'content'
    selectApplianceOption.textContent = item
    applianceSelect.appendChild(selectApplianceOption)
  })
}

function displaySelectUstensils(listOfAllUstensils) {
  const ustensilsSelect = document.getElementById('ustensils')

  const listOfUstensils = listOfAllUstensils.filter((item, index) => listOfAllUstensils.indexOf(item) === index)
  console.log(listOfUstensils)

  listOfUstensils.forEach((item) => {
    // Create an "option" tag for each select ustensil option
    const selectUstensilOption = document.createElement('option')
    selectUstensilOption.className = 'content'
    selectUstensilOption.textContent = item
    ustensilsSelect.appendChild(selectUstensilOption)
  })
}

// Open select dropdown //

const selectOptionsButton = document.querySelectorAll('.dropdown_buttton')
console.log(selectOptionsButton)
selectOptionsButton.forEach((btn) => btn.addEventListener("click", (e) => {
  console.log(e.target.id)
  switch (e.target.id) {
    case 'ingredients_btn':
      const dropdownIngredients = document.getElementById('ingredients').classList.toggle('show');
      break
    case 'appliance_btn':
      const dropdownAppliance = document.getElementById('appliance').classList.toggle('show');
      break
    case 'ustensils_btn':
      const dropdownUstensils = document.getElementById('ustensils').classList.toggle('show');
      break
    default:
      console.error('error')
  }
}))

// Filter select dropdown //
const selectOptionsInput = document.querySelectorAll('.input')
selectOptionsInput.forEach((input) => input.addEventListener('keyup', (e) => {
  switch (e.target.id) {
    case 'ingredients_input':
      filterIngredients();
      break
    case 'appliance_input':
      filterAppliance();
      break
    case 'ustensils_input':
      filterUstensils();
      break
    default:
      console.error('error');
  }
}))

function filterIngredients() {
  const input = document.getElementById('ingredients_input');
  let filter = input.value.toUpperCase();
  const ingredients = document.getElementById('ingredients');
  let option = ingredients.getElementsByTagName('option');

  for (let i = 0; i < option.length; i++) {
    let value = option[i].textContent || option[i].innerText;
    if (value.toUpperCase().indexOf(filter) > -1) {
      option[i].style.display = "";
    } else {
      option[i].style.display = "none";
    }
  }
}

function filterAppliance() {
  const input = document.getElementById('appliance_input');
  let filter = input.value.toUpperCase();
  const appliance = document.getElementById('appliance');
  let option = appliance.getElementsByTagName('option');

  for (let i = 0; i < option.length; i++) {
    let value = option[i].textContent || option[i].innerText;
    if (value.toUpperCase().indexOf(filter) > -1) {
      option[i].style.display = "";
    } else {
      option[i].style.display = "none";
    }
  }
}

function filterUstensils() {
  const input = document.getElementById('ustensils_input');
  let filter = input.value.toUpperCase();
  const ustensils = document.getElementById('ustensils');
  let option = ustensils.getElementsByTagName('option');

  for (let i = 0; i < option.length; i++) {
    let value = option[i].textContent || option[i].innerText;
    if (value.toUpperCase().indexOf(filter) > -1) {
      option[i].style.display = "";
    } else {
      option[i].style.display = "none";
    }
  }
}
