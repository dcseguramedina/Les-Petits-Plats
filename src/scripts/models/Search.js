export default class Search {
  results = []
  searchHistory = []

  isAdvancedSearch = false

  constructor(data, categories, input) {
    this.data = data
    this.categories = categories
    this.input = input
  }

  handleSearch() {
    console.log("hello from handleSearch")
    // Determine the input source based on search type
    const inputSource = this.input.value
    console.log(inputSource)

    // Convert the search input to lowercase
    const lowercaseInput = inputSource.toLowerCase()

    // Reset results array
    this.results = []

    // Search by category and push the results into the results array
    for (const category of this.categories) {
      if (isAdvancedSearch === false) {
        const matches = this.searchRecipes(lowercaseInput, category)
        this.results = this.results.concat(matches)
      } else {
        const matches = this.searchRecipes(lowercaseInput, category, true)
        this.results = this.results.concat(matches)
      }     
    }

    // Define an object with the search details
    const searchDetails = {
      input: lowercaseInput,
      result: this.results
    }
    console.log(searchDetails)

    if (this.results.length !== 0) {
      console.log("hello from search results")
      // Save the search details to search history
      this.searchHistory.push(searchDetails)

      // Save the search history to localStorage
      this.saveToLocalStorage()

      // Add a tag related to the search input
      if (searchDetails.result.length !== 0) {
        this.createSearchTag(searchDetails)
      }

      // Display search results
      this.displayResults(searchDetails)
    } else {
      console.log("hello from no results")
      this.displayNoResultsMessage(searchDetails)
    }

    // Clean input    
    this.input.value = ''
  }

  searchRecipes(lowercaseInput, category, isAdvancedSearch = false) {
    let dataToFilter;
  
    if (!isAdvancedSearch) {
      // Initial search on JSON data
      dataToFilter = this.data;
    } else {
      // Advanced search on local storage data
      const allResultArrays = this.searchHistory.map((item) => item.result);
      const allResults = allResultArrays.flat();
      dataToFilter = [...new Set(allResults.map(JSON.stringify))].map(JSON.parse);
    }
  
    console.log(dataToFilter)

    // Filter the data based on the search criteria
    return dataToFilter.filter((recipe) => {
      switch (category) {
        case 'title':
          return recipe.name.toLowerCase().includes(lowercaseInput);
        case 'ingredients':
          return recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(lowercaseInput)
          );
        case 'description':
          return recipe.description.toLowerCase().includes(lowercaseInput);
        case 'appliance':
          return recipe.appliance.toLowerCase().includes(lowercaseInput);
        case 'ustensils':
          return recipe.ustensils.some(ustensil =>
            ustensil.toLowerCase().includes(lowercaseInput)
          );
        default:
          return false;
      }
    });
  }

  // Save results to localStorage
  saveToLocalStorage() {
    try {
      const resultsJSON = JSON.stringify(this.searchHistory)
      localStorage.setItem('searchHistory', resultsJSON)
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de l'historique de recherche:`, error)
    }
  }

  displayResults() {
    // Update the DOM to show the results
    const availableRecipes = Array.from(document.querySelectorAll('.recipe_card'))

    this.searchHistory = this.getFromLocalStorage()

    const resultIds = new Set(
      this.searchHistory.flatMap((history) => history.result.map((recipe) => recipe.id.toString()))
    )

    // Filter and display/hide recipe cards
    availableRecipes.forEach(card => {
      const cardId = card.getAttribute('data-id')
      if (resultIds.has(cardId)) {
        // This card is in the results, so display it
        card.style.display = 'block'
      } else {
        // This card is not in the results, so hide it
        card.style.display = 'none'
      }
    })

    this.updateSearchResultsNumber(resultIds)
  }

  displayNoResultsMessage(searchDetails) {
    console.log("hello from no results function")
    const recipesSection = document.querySelector('.recipes_section')

    if (searchDetails.result.length === 0) {
      const noResultsMessage = document.createElement('p')
      noResultsMessage.className = 'no-results-message'
      noResultsMessage.textContent = `Aucune recette ne contient "${searchDetails.input}" vous pouvez chercher «tarte aux pommes », « poisson », etc.`
      recipesSection.insertBefore(noResultsMessage, recipesSection.firstChild)
    } else {
      recipesSection.removeChild(noResultsMessage)
    }
  }


  updateSearchResultsNumber(resultIds) {
    const recipesNumber = document.getElementById('recipes_number')
    let number = resultIds.size
    recipesNumber.textContent = `${number} recettes`
  }

  createSearchTag(searchDetails) {
    if (searchDetails.input !== '') {
      const tagSection = document.getElementById('tag_section')

      const tagElement = document.createElement('div')
      tagElement.classList.add('tag')
      tagElement.setAttribute('data-keyword', searchDetails.input)
      tagSection.appendChild(tagElement)

      const keywordElement = document.createElement('span')
      keywordElement.classList.add('keyword')
      keywordElement.textContent = searchDetails.input
      tagElement.appendChild(keywordElement)

      const closeElement = document.createElement('button')
      closeElement.classList.add('close')
      closeElement.type = 'button'
      closeElement.textContent = 'x'
      tagElement.appendChild(closeElement)

      // Attach the event listener to the close button
      // "bind(this)" to keep the reference to the object (in this) and prevent it from being overwritten by the event
      closeElement.addEventListener('click', this.closeSearchTag.bind(this))
    }
  }

  closeSearchTag(event) {
    // Remove the entire tag element
    const tagElement = event.target.parentElement
    const tagRelatedInput = tagElement.getAttribute('data-keyword')
    tagElement.remove()


    let searchResults = this.getFromLocalStorage()
    const tagRelatedSearch = searchResults.find((search) => search.input === tagRelatedInput)

    if (tagRelatedSearch) {
      this.removeFromSearchHistory(tagRelatedSearch)
    }

    if (this.searchHistory.length !== 0) {
      this.searchHistory.forEach((search) => {
        // “Reset” the input to avoid creating a tag
        search.input = ""
        this.displayResults(search)
      })
    } else {
      console.log("Helo from else")
      this.resetToInitialState()
    }
  }

  resetToInitialState() {
    // Update the DOM to show the inial available recipes
    const availableRecipes = Array.from(document.querySelectorAll('.recipe_card'))
    console.log(availableRecipes)

    availableRecipes.forEach(card => {
      card.style.display = 'block'
    })

    localStorage.clear()

    const recipesNumber = document.getElementById('recipes_number')
    recipesNumber.textContent = `${availableRecipes.length} recettes`
  }

  // Retrieve search results from localStorage
  getFromLocalStorage() {
    try {
      const resultsJSON = localStorage.getItem('searchHistory')
      return resultsJSON ? JSON.parse(resultsJSON) : []
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'historique de recherche`, error)
      return []
    }
  }

  // Remove a search from history
  removeFromSearchHistory(tagRelatedSearch) {
    let searchHistory = this.getFromLocalStorage()
    this.searchHistory = searchHistory.filter((search) => search.input !== tagRelatedSearch.input)
    this.saveToLocalStorage()
  }
}
