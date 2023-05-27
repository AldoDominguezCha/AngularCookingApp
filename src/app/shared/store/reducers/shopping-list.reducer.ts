import { Ingredient } from "../../ingredient.model";
import { ADD_INGREDIENT, ADD_INGREDIENTS, DELETE_INGREDIENT, UPDATE_INGREDIENT } from "../actions/action-types.contants";
import { ShoppingListAction } from "../actions/shopping-list.generators";

export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: ShoppingListState = {
  ingredients : [
    new Ingredient('Cheese', 150),
    new Ingredient('Basil', 20),
    new Ingredient('Pasta', 350),
  ],
  editedIngredient: null,
  editedIngredientIndex: null,
};

export function shoppingListReducer(state = initialState, action: ShoppingListAction) {
  switch(action.type) {
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case UPDATE_INGREDIENT:
      const ingredients = [...state.ingredients];
      ingredients.splice(action.payload.id, 1, action.payload.ingredient);
      return {
        ...state,
        ingredients
      };
    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients].filter((ing, idx) => idx !== action.payload)
      };
    default:
      return state;
  }
}
