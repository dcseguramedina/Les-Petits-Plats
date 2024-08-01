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
  })

  displaySelectOptions(listOfRecipeIngredients, 'ingredients')
  displaySelectOptions(listOfRecipeAppliances, 'appliance')
  displaySelectOptions(listOfRecipeUstensils, 'ustensils')
}
displayHomePage()

// Display select options on Home page //
function displaySelectOptions(listOfOptions, selectId) {
  const select = document.getElementById(selectId)

  if (!select) {
    console.error(`Select element with id ${selectId} not found`)
    return
  }

  const listOfUniqueOptions = [...new Set(listOfOptions)]
  const fragment = document.createDocumentFragment()

  listOfUniqueOptions.forEach((item) => {
    const option = document.createElement('option')
    option.className = 'content'
    option.textContent = item
    fragment.appendChild(option)
  })

  select.appendChild(fragment)
}

// Manage open/close select dropdown //
const selectDropdown = document.querySelectorAll('.select_dropdown');

selectDropdown.forEach(select => {
  select.addEventListener('keydown', handleDropdownToggle)
  select.addEventListener('click', handleDropdownToggle)
})

function handleDropdownToggle(event) {
  const key = event.key
  if (key === "Enter" || key === " " || event.type === 'click') {
    event.preventDefault()
    toggleDropdown(event.target)
  }
}

function toggleDropdown(select) {
  const selectId = select.id
  const dropdownId = {
    'ingredients_btn': 'ingredients',
    'appliance_btn': 'appliance',
    'ustensils_btn': 'ustensils'
  }[selectId]

  if (!dropdownId) return

  const dropdown = document.getElementById(dropdownId)

  if (!dropdown) {
    console.error(`Dropdown element with id ${dropdownId} not found`)
    return
  }

  dropdown.classList.toggle('show')
  select.style.borderRadius = dropdown.classList.contains('show') ? '10px 10px 0 0' : '10px'
}

// Filter options on select dropdown //
const selectOptionsInput = document.querySelectorAll('.input');

selectOptionsInput.forEach((input) => {
  input.addEventListener('keyup', event => {
    const inputId = event.target.id
    const dropdownId = {
      'ingredients_input': 'ingredients',
      'appliance_input': 'appliance',
      'ustensils_input': 'ustensils'
    }[inputId]

    if (!dropdownId) {
      console.error('Invalid input id')
      return;
    }

    filterOptions(inputId, dropdownId)
  })
})

// Manage filter options  //
function filterOptions(inputId, dropdownId) {
  const input = document.getElementById(inputId)
  const filter = input.value.toLowerCase()
  const dropdown = document.getElementById(dropdownId)
  const options = dropdown.getElementsByTagName('option')

  Array.from(options).forEach(option => {
    const searchInput = option.textContent || option.innerText
    const isVisible = searchInput.toLowerCase().includes(filter)
    option.style.display = isVisible ? '' : 'none'

    if (isVisible && !option.getAttribute('data-eventlistener')) {
      option.addEventListener('click', handleOptionClick)
      // To avoid resetting the eventListener at each loop turn
      option.setAttribute('data-eventlistener', true)
    }
  })
}

function handleOptionClick(event) {
  const selectedOptionInput = event.target
  const dropdown = selectedOptionInput.closest('.dropdown_content')
  dropdown.classList.remove('show')
  const dropdownPrevious = dropdown.previousElementSibling;
  dropdownPrevious.style.borderRadius = '10px'

  const input = dropdown.querySelector('.input')
  input.value = ''

  handleSelectSearch(selectedOptionInput.textContent, dropdownPrevious.id)
}

// MANAGE SEARCHBAR SEARCH OPTIONS //
const categories = ['title', 'ingredients', 'description']
const inputElement = document.getElementById("search")
const searchBtnElement = document.getElementById("search_button")
const searchInstance = new Search(listOfRecipes, categories, inputElement)

inputElement.addEventListener('keydown', event => {
  if (event.key === "Enter") {
    event.preventDefault()
    handleSearch()
  }
})

searchBtnElement.addEventListener('click', handleSearch)

function handleSearch() {
  if (inputElement.value.length < 3) {
    alert('Veuillez saisir au moins 3 caractères.')
    return
  }

  searchInstance.handleSearch()
  updateSelectOptions()
}

// Update select options according to search results
function updateSelectOptions() {
  const optionsDropdown = document.querySelectorAll('option')
  optionsDropdown.forEach(option => option.remove())

  const visibleRecipeCards = Array.from(document.querySelectorAll('.recipe_card')).filter(card => {
    const style = window.getComputedStyle(card)
    return style.display !== 'none'
  });

  const displayedRecipes = visibleRecipeCards.map(card => ({
    id: card.getAttribute('data-id'),
    ingredients: card.getAttribute('data-ingredients').split(','),
    appliance: card.getAttribute('data-appliance'),
    ustensils: card.getAttribute('data-ustensils').split(',')
  }))

  const listOfResultsIngredients = [...new Set(displayedRecipes.flatMap(recipe => recipe.ingredients))]
  const listOfResultsAppliances = [...new Set(displayedRecipes.map(recipe => recipe.appliance))]
  const listOfResultsUstensils = [...new Set(displayedRecipes.flatMap(recipe => recipe.ustensils))]

  displaySelectOptions(listOfResultsIngredients, 'ingredients')
  displaySelectOptions(listOfResultsAppliances, 'appliance')
  displaySelectOptions(listOfResultsUstensils, 'ustensils')
}

// MANAGE SELECT SEARCH OPTIONS //
function handleSelectSearch(selectedOption, dropdownId) {
  const searchInput = document.getElementById('search')
  searchInput.value = selectedOption

  const searchInstance = new Search(listOfRecipes, categories, searchInput)
  searchInstance.handleSearch()
  updateSelectOptions()
}
