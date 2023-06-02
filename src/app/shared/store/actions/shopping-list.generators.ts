import { Action } from '@ngrx/store';

import {
  ADD_INGREDIENT,
  ADD_INGREDIENTS,
  DELETE_INGREDIENT,
  SHOPPING_LIST_START_EDIT,
  SHOPPING_LIST_STOP_EDIT,
  UPDATE_INGREDIENT,
} from './action-types.contants';
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
  readonly type = SHOPPING_LIST_START_EDIT;
  constructor(public payload: number) {}
}

export class StopIngredientEdit {
  readonly type = SHOPPING_LIST_STOP_EDIT;
}

export type ShoppingListAction =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartIngredientEdit
  | StopIngredientEdit;
