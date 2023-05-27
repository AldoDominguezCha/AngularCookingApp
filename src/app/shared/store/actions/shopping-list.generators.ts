import { Action } from '@ngrx/store';

import { ADD_INGREDIENT, ADD_INGREDIENTS, DELETE_INGREDIENT, UPDATE_INGREDIENT } from './action-types.contants';
import { Ingredient } from '../../ingredient.model';

//Shopping list

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;
  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  constructor(public payload: { id: number, ingredient: Ingredient }) {}
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;
  constructor(public payload: number) {}
}

export type ShoppingListAction = AddIngredient | AddIngredients | UpdateIngredient | DeleteIngredient;
