// Importing
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
//?These Two packages are for the old browsers support
import 'core-js/stable';
import 'regenerator-runtime/runtime';
//?so they support our es6+ code to run in any old browser

//!>> Related To Parcel for (Not Reloading the page which is keep the data after saving new enhancments)
// if (module.hot) {
//   module.hot.accept();
// }
// Functions
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // Guard Clause
    if (!id) return;
    recipeView.renderSpinner();

    //0) Update results view to mark selected search result
    resultsView.render(model.getSearchResultPage());
    //1) Loading Recipe
    await model.loadRecipe(id);

    //2) Rendering the recipe
    recipeView.render(model.state.recipe);

    //3) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError(`${err}😒😒`);
    console.error(err);
  }
};

controlRecipes();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    // Gaurd Clause HERE!!
    if (!query) return;

    // 2) Load search results
    await model.loadSearchresults(query);

    //! Pagination logic;
    // 3) Render results
    resultsView.render(model.getSearchResultPage());
    // resultsView.render(model.state.search.results, true);

    paginationView.render(model.state.search);
    // 4) Render initial pagination buttons
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  //! Pagination logic;
  // 1) Render NEW results
  resultsView.render(model.getSearchResultPage(goToPage));

  paginationView.render(model.state.search);
  // 2) Render NEW pagination buttons
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2) Update recipe view
  recipeView.update(model.state.recipe);
  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Succes message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    window.history.back();

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err + 'Recipes🤭');
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log(`Welcome to the application`);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
