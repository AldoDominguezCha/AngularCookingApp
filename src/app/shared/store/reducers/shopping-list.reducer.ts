import { Action } from "@ngrx/store";

import { Ingredient } from "../../ingredient.model";
import { ADD_INGREDIENT } from "../actions/action-types.contants";
import { AddIngredient } from "../actions/shopping-list.generators";

const initialState = {
  ingredients : [
    new Ingredient('Cheese', 150),
    new Ingredient('Basil', 20),
    new Ingredient('Pasta', 350),
  ],
};

export function shoppingListReducer(state = initialState, action: AddIngredient) {
  switch(action.type) {
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      }
  }
}
