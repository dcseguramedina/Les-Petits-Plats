export default class Recipe {
  constructor(id, image, name, servings, ingredients, time, description, appliance, ustensils) {
    this.id = id
    this.image = image
    this.name = name
    this.servings = servings
    this.ingredients = ingredients
    this.time = time
    this.description = description
    this.appliance = appliance
    this.ustensils = ustensils
  }

  displayRecipeCard() {
    const recipesSection = document.querySelector('.recipes_section')

    // Create an "article" tag dedicated to a recipe
    const recipeCard = document.createElement('article')
    recipeCard.className = 'recipe_card'
    recipesSection.appendChild(recipeCard)
    
    // Create an "div" tag for each recipe's image
    const recipeImage = document.createElement('div')
    recipeImage.className = 'recipe_image'
    recipeCard.appendChild(recipeImage)

     // Create an "span" tag for each recipe's time
    const temps = document.createElement('span')
    temps.className = 'temps'
    temps.textContent = this.time + `min`
    recipeImage.appendChild(temps)

    // Create an "img" tag for each recipe's image
    const image = document.createElement('img')
    image.className = 'image'
    image.src = `../src/assets/recipes/${this.image}`
    image.alt = this.name
    recipeImage.appendChild(image)

    // Create an "div" tag for each recipe's idetails
    const recipeDetails = document.createElement('div')
    recipeDetails.className = 'recipe_details'
    recipeCard.appendChild(recipeDetails)

    // Create a "h2" tag for each recipe's name
    const recipeName = document.createElement('h2')
    recipeName.textContent = this.name
    recipeDetails.appendChild(recipeName)

    // Create an "div" tag for recipe
    const recipe = document.createElement('div')
    recipe.className = 'recipe'
    recipeDetails.appendChild(recipe)

    // Create a "h3" tag for recipe
    const recipeTitle = document.createElement('h3')
    recipeTitle.className = 'mt-7'
    recipeTitle.textContent = 'recette'
    recipe.appendChild(recipeTitle)

    // Create a "p" tag for each recipe's description
    const recipeDescription = document.createElement('p')
    recipeDescription.className = 'mt-5'
    recipeDescription.textContent = this.description
    recipe.appendChild(recipeDescription)

    // Create an "div" tag for ingredients
    const ingredients = document.createElement('div')
    ingredients.className = `ingredients`
    recipeDetails.appendChild(ingredients)

    // Create a "h3" tag for ingredients
    const ingredientsTitle = document.createElement('h3')
    ingredientsTitle.className = 'mt-7'
    ingredientsTitle.textContent = `ingrédients`
    ingredients.appendChild(ingredientsTitle)

    // Create a "div" tag for recipe's ingredients
    const recipeIngredients = document.createElement('div')
    recipeIngredients.className = 'recipe_ingredients'
    // recipeIngredients.textContent = this.setIngredients()
    ingredients.appendChild(recipeIngredients)

    let ingredientsList = this.ingredients

      for (let i = 0; i < ingredientsList.length; i++) {
  
        // Create a "ul" tag for recipe's ingredients
        const list = document.createElement('ul')
        list.className = 'mt-5'
        recipeIngredients.appendChild(list)
  
        // Create a "li" tag for each ingredient
        const ingredient = document.createElement('li')
        ingredient.textContent = ingredientsList[i].ingredient
        list.appendChild(ingredient)
  
        // Create a "li" tag for each quantity
        const quantity = document.createElement('li')
        quantity.className = 'text-stone-500'
        quantity.textContent = (ingredientsList[i].quantity ? ingredientsList[i].quantity : "") + (ingredientsList[i].unit ? ingredientsList[i].unit : "")
        list.appendChild(quantity)
      }
  }
}
