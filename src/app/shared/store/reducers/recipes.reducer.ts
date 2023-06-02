import { Recipe } from "src/app/recipes/recipe.model";
import { RecipesAction } from "../actions/recipes.generators";
import { ADD_RECIPE, DELETE_RECIPE, FETCH_RECIPES, SET_RECIPES, STORE_RECIPES, UPDATE_RECIPE } from "../actions/action-types.contants";

export interface RecipesState {
  recipes: Recipe[];
}

const initialState: RecipesState = {
  recipes: [],
};

export function recipesReducer(state = initialState, action: RecipesAction) {
  switch(action.type) {
    case SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      }
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, {...action.payload}]
      }
    case UPDATE_RECIPE:
      const targetRecipe = {...state.recipes[action.payload.index], ...action.payload.recipe};
      const updatedRecipes = [...state.recipes];
      updatedRecipes.splice(action.payload.index, 1, targetRecipe);
      return {
        ...state,
        recipes: updatedRecipes,
      }
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, idx) => idx !== action.payload),
      }
    case FETCH_RECIPES:
    case STORE_RECIPES:
    default:
      return {
        ...state
      };
  }
}
