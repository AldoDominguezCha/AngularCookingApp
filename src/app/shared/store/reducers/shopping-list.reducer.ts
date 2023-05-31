import { Ingredient } from "../../ingredient.model";
import { ADD_INGREDIENT, ADD_INGREDIENTS, DELETE_INGREDIENT, START_EDIT, STOP_EDIT, UPDATE_INGREDIENT } from "../actions/action-types.contants";
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
      ingredients.splice(state.editedIngredientIndex, 1, action.payload);
      return {
        ...state,
        ingredients,
        editedIngredientIndex: null,
        editedIngredient: null
      };
    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients].filter((ing, idx) => idx !== state.editedIngredientIndex),
        editedIngredientIndex: null,
        editedIngredient: null
      };
    case START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: {...state.ingredients[action.payload]}
      }
    case STOP_EDIT:
      return {
        ...state,
        editedIngredientIndex: null,
        editedIngredient: null
      }
    default:
      return state;
  }
}
