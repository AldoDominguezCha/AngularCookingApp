import { Action } from '@ngrx/store';

import { ADD_INGREDIENT, ADD_INGREDIENTS, DELETE_INGREDIENT, START_EDIT, STOP_EDIT, UPDATE_INGREDIENT } from './action-types.contants';
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
  constructor(public payload: Ingredient) {}
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;
}

export class StartIngredientEdit {
  readonly type = START_EDIT;
  constructor(public payload: number) {}
}

export class StopIngredientEdit {
  readonly type = STOP_EDIT;
}

export type ShoppingListAction =
  AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartIngredientEdit
  | StopIngredientEdit;
