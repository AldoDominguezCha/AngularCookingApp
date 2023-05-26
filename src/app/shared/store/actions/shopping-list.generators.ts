import { Action } from '@ngrx/store';

import { ADD_INGREDIENT } from './action-types.contants';
import { Ingredient } from '../../ingredient.model';

//Shopping list

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  payload: Ingredient;
}
