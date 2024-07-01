export default class Search {
  searchHistory = []

  constructor(data, input) {
    this.data = data;
    this.input = input;
  }

  handleSearchFromSearchBar() {
    // Check if the input is at least 3 characters long
    if (this.input.value.length < 3) {
      alert(`Veuillez saisir au moins 3 caractères.`);
      return;
    }

    // Define the array of available categories to search on searchbar
    const categories = ['title', 'ingredients', 'description'];

    // Convert the search input to lowercase
    const lowercaseInput = this.input.value.toLowerCase();

    // Define the array to save the search results
    let results = [];

    // Search by category and push the results into the matches array
    for (const category of categories) {
      const matches = this.searchFromSearchBar(category, lowercaseInput);
      results = results.concat(matches);
    }

    // Define an onject with the search details
    const searchDetails = {
      input: lowercaseInput,
      result: results
    }

    // Save the search details to history
    this.searchHistory.push(searchDetails)

    // Save the search history to localStorage
    this.saveSearchResults();

    // Display the search results
    this.displayResults(searchDetails);

    // Clean search bar
    this.input.value = '';
  }

  handleSearchFromSelect() {
    // Define the array of available categories to search
    const categories = ['ingredients', 'appliance', 'ustensils'];
    console.log(categories)

    const lowercaseInput = this.input.textContent.toLowerCase();
    console.log(lowercaseInput)

    // Retrieve search history
    // this.searchHistory = this.getSearchResults();
    // console.log(this.searchHistory)    

    // Define the array to save the search results
    let results = [];

    // Search by category and push the results into the matches array
    for (const category of categories) {
      const matches = this.searchFromSelect(category, lowercaseInput);
      results = results.concat(matches);
    }

    // Define an onject with the search details
    const searchDetails = {
      input: lowercaseInput,
      result: results
    }
    console.log(searchDetails)

    // const dataToSearch = this.searchHistory || this.data;
    // console.log(dataToSearch)

    // results = categories.flatMap(category =>
    //   this.search(category, input)
    // );

    // Save the search details to history
    this.searchHistory.push(searchDetails)

    // Save the search history to localStorage
    this.saveSearchResults();

    // Display the search results
    this.displayResults(searchDetails);
  }


  searchFromSearchBar(category, lowercaseInput) {
    // Filter the all the arrays by category to find matches
    return this.data.filter((recipe) => {
      switch (category) {
        case 'title':
          return recipe.name.toLowerCase().includes(lowercaseInput);
        case 'ingredients':
          return recipe.ingredients.some((ingredient) =>
            ingredient.ingredient.toLowerCase().includes(lowercaseInput)
          );
        case 'description':
          return recipe.description.toLowerCase().includes(lowercaseInput);
        default:
          return false;
      }
    });
  }

  searchFromSelect(category, lowercaseInput) {
    // Filter the array by selected category to find matches
    return this.data.filter((recipe) => {
      switch (category) {
        case 'ingredients':
          return recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(lowercaseInput)
          );
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

  // Save search results to localStorage
  saveSearchResults() {
    try {
      const resultsJSON = JSON.stringify(this.searchHistory);
      localStorage.setItem('searchHistory', resultsJSON);
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de l'historique de recherche:`, error);
    }
  }

  displayResults(searchDetails) {

    // Add a tag related to the search input
    if (searchDetails.result.length !== 0) {
      this.createSearchTag(searchDetails)
    }
    // Update the DOM to show the results
    const allRecipeCards = document.querySelectorAll('.recipe_card');

    const resultIds = new Set(
      this.searchHistory.flatMap((history) => history.result.map((recipe) => recipe.id.toString()))
    );

    // Filter and display/hide recipe cards
    allRecipeCards.forEach(card => {
      const cardId = card.getAttribute('data-id');
      if (resultIds.has(cardId)) {
        // This card is in the results, so display it
        card.style.display = 'block';
      } else {
        // This card is not in the results, so hide it
        card.style.display = 'none';
      }
    });


    // Handle case when there are no results
    const recipesSection = document.querySelector('.recipes_section');
    if (resultIds.size === 0) {
      let noResultsMessage = document.querySelector('.no-results-message');
      if (!noResultsMessage) {
        noResultsMessage = document.createElement('p');
        noResultsMessage.className = 'no-results-message';
        recipesSection.appendChild(noResultsMessage);
      }
      noResultsMessage.textContent = `Aucune recette ne contient "${searchDetails.input}" vous pouvez chercher «tarte aux pommes », « poisson », etc.`;
      recipesSection.style.minHeight = '100vh';
    } else {
      const noResultsMessage = document.querySelector('.no-results-message');
      if (noResultsMessage) {
        noResultsMessage.remove();
      }
    }

    this.updateSearchResultsNumber(resultIds)
  }

  updateSearchResultsNumber(resultIds) {
    const recipesNumber = document.getElementById('recipes_number');
    let number = resultIds.size
    recipesNumber.textContent = `${number} recettes`;

  }

  createSearchTag(searchDetails) {
    if (searchDetails.input !== '') {
      const tagSection = document.getElementById('tag_section');

      const tagElement = document.createElement('div');
      tagElement.classList.add('tag');
      tagElement.setAttribute('data-keyword', searchDetails.input);
      tagSection.appendChild(tagElement);

      const keywordElement = document.createElement('span');
      keywordElement.classList.add('keyword');
      keywordElement.textContent = searchDetails.input;
      tagElement.appendChild(keywordElement);

      const closeElement = document.createElement('button');
      closeElement.classList.add('close');
      closeElement.type = 'button';
      closeElement.textContent = 'x';
      tagElement.appendChild(closeElement);

      // Attach the event listener to the close button
      closeElement.addEventListener('click', this.closeSearchTag);
    }
  }

  closeSearchTag(event) {
    // Remove the entire tag element
    const tagElement = event.target.parentElement;
    const tagRelatedInput = tagElement.getAttribute('data-keyword')
    tagElement.remove();

    let searchResults = this.getSearchResults();

    if (!searchResults || !Array.isArray(searchResults)) {
      console.error(`Aucun historique de recherche valide n'a été trouvé`);
      return;
    }

    const tagRelatedSearch = searchResults.find((search) => search.input === tagRelatedInput);

    if (tagRelatedSearch) {
      this.removeFromSearchHistory(tagRelatedSearch);
    } else {
      console.log(`Aucune recherche n'a été trouvée pour:`, tagRelatedInput);
    }
  }

  // Retrieve search results from localStorage
  getSearchResults() {
    try {
      const resultsJSON = localStorage.getItem('searchHistory');
      return resultsJSON ? JSON.parse(resultsJSON) : [];
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'historique de recherche`, error);
      return [];
    }
  }

  // Remove a search from history
  removeFromSearchHistory(tagRelatedSearch) {
    // const latestResultIds = new Set(
    //   searchHistory[searchHistory.length - 1].result.map(recipe => recipe.id.toString())
    // );

    let searchHistory = this.getSearchResults();
    searchHistory = searchHistory.filter((search) => search.input !== tagRelatedSearch.input);
    this.saveSearchResults(searchHistory);
  }
}









// // Handle search on select dropdown //
// function handleSearchFromSelect(event, dropdownId) {
//   const galleryElements = document.querySelector('.recipes_section');
//   const recipeCards = galleryElements.querySelectorAll('article')

//   let searchInput = event.target;
//   let searchValue = event.target.textContent;
//   let allMatches = [];

//   // if (recipeCards.length === 50) {
//   const filteredRecipes = listOfRecipes.filter(recipe => {
//     if (dropdownId === 'ingredients') {
//       return recipe.ingredients.some(ingredient =>
//         ingredient.ingredient.includes(searchValue)
//       );
//     } else if (dropdownId === 'appliance') {
//       return recipe.appliance.includes(searchValue);
//     } else if (dropdownId === 'ustensils') {
//       return recipe.ustensils.some(ustensil =>
//         ustensil.includes(searchValue)
//       );
//     }
//   });

//   allMatches.push(filteredRecipes);
//   // } else {
//   //   const filteredRecipes = listOfFilteredRecipes.filter(recipe => {
//   //     if (dropdownId === 'ingredients') {
//   //       return recipe.ingredients.some(ingredient =>
//   //         ingredient.ingredient.includes(searchValue)
//   //       );
//   //     } else if (dropdownId === 'appliance') {
//   //       return recipe.appliance.includes(searchValue);
//   //     } else if (dropdownId === 'ustensils') {
//   //       return recipe.ustensils.some(ustensil =>
//   //         ustensil.includes(searchValue)
//   //       );
//   //     }
//   //   });

//   //   allMatches.push(filteredRecipes);
//   // }

//   const allMatchesList = allMatches.flat();
//   console.log(allMatchesList);

//   const listOfSelectFilteredRecipes = [...new Set(allMatchesList)];
//   console.log(listOfSelectFilteredRecipes);

//   cleanSelectOptions()
//   cleanRecipesGallery()
//   updateSelectAndRecipes(listOfSelectFilteredRecipes)
//   updateRecipesNumber(listOfSelectFilteredRecipes)
//   createTag(searchInput)
// }