export default class SearchBar {
  constructor(data, categories, input) {
    this.data = data
    this.categories = categories
    this.input = input
    this.searchBarResults = []
    this.selectResults = []
    this.combinedResults = []
    this.searchHistory = this.getFromLocalStorage()
  }

  handleSearchBarSearch() {
    const inputSource = this.input.value.toLowerCase().trim()
    console.log(inputSource)

    if (inputSource.length < 3) {
      alert('Veuillez saisir au moins 3 caractères.')
      return
    }

    this.searchBarResults = this.searchRecipes(inputSource, this.categories)
    console.log(this.searchBarResults)
    this.updateCombinedResults()
    this.displayResults()
    this.createSearchTag({ input: inputSource, type: 'searchBar' })
    this.input.value = ''
  }

  handleSelectSearch(selectedOption, category) {
    const lowercaseInput = selectedOption.toLowerCase().trim()
    const selectResult = this.searchRecipes(lowercaseInput, [category])

    // Remove any existing select result for this category
    this.selectResults = this.selectResults.filter((result) => result.category !== category)

    if (selectResult.length > 0) {
      this.selectResults.push({ category, results: selectResult });
    }

    this.updateCombinedResults()
    this.displayResults()
    this.createSearchTag({ input: selectedOption, type: 'select', category })
  }

  updateCombinedResults() {
    if (this.searchBarResults.length > 0 && this.selectResults.length > 0) {
      // Intersection of search bar results and all select results
      this.combinedResults = this.searchBarResults.filter((recipe) =>
        this.selectResults.every((selectResult) =>
          selectResult.results.some((r) => r.id === recipe.id)
        )
      )
    } else if (this.searchBarResults.length > 0) {
      this.combinedResults = this.searchBarResults
    } else if (this.selectResults.length > 0) {
      // Intersection of all select results
      this.combinedResults = this.selectResults.reduce((acc, curr) =>
        acc.filter((recipe) => curr.results.some((r) => r.id === recipe.id)),
        this.data
      );
    } else {
      this.combinedResults = []
    }

    const searchDetails = {
      input: this.input.value,
      result: this.combinedResults
    };
    console.log(searchDetails)
    this.searchHistory.push(searchDetails)
    console.log(this.searchHistory)
    this.saveToLocalStorage()
  }

  searchRecipes(lowercaseInput, categoriesToSearch) {
    return this.data.filter((recipe) =>
      categoriesToSearch.some((category) => this.matchCategory(recipe, category, lowercaseInput))
    )
  }

  matchCategory(recipe, category, input) {
    switch (category) {
      case 'title':
        return recipe.name.toLowerCase().includes(input);
      case 'ingredients':
        return recipe.ingredients.some((ingredient) => ingredient.ingredient.toLowerCase().includes(input));
      case 'description':
        return recipe.description.toLowerCase().includes(input);
      case 'appliance':
        return recipe.appliance.toLowerCase().includes(input);
      case 'ustensils':
        return recipe.ustensils.some((ustensil) => ustensil.toLowerCase().includes(input));
      default:
        return false;
    }
  }

  saveToLocalStorage() {
    try {
      const resultsJSON = JSON.stringify(this.searchHistory)
      localStorage.setItem('searchHistory', resultsJSON)
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de l'historique de recherche:`, error)
    }
  }

  displayResults() {
    const availableRecipes = document.querySelectorAll('.recipe_card');
    const resultIds = new Set(this.combinedResults.map((recipe) => recipe.id.toString()))
    console.log(resultIds)

    availableRecipes.forEach((card) => {
      card.style.display = resultIds.has(card.getAttribute('data-id')) ? 'block' : 'none'
    })

    this.updateSearchResultsNumber(resultIds)

    if (resultIds.size === 0) {
      this.displayNoResultsMessage()
    } else {
      this.removeNoResultsMessage()
    }
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

  removeNoResultsMessage() {

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
      // “bind(this)” to keep the reference to the object (this) and prevent it from being overwritten by the event
      closeElement.addEventListener('click', this.closeSearchTag.bind(this))
    }
  }

  closeSearchTag(event) {
    const tagElement = event.target.closest('.tag')
    if (!tagElement) return

    const tagRelatedInput = tagElement.getAttribute('data-keyword')
    const tagType = tagElement.getAttribute('data-type')
    const tagCategory = tagElement.getAttribute('data-category')
    tagElement.remove()

    if (tagType === 'searchBar') {
      this.searchBarResults = []
    } else if (tagType === 'select') {
      this.selectResults = this.selectResults.filter((result) => result.category !== tagCategory)
    }

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

    this.updateCombinedResults()
    this.displayResults()
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
  