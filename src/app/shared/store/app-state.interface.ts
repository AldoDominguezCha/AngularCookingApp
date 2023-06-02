import { ActionReducerMap } from "@ngrx/store";

import { AuthReducer, AuthState } from "./reducers/auth.reducer";
import { ShoppingListState, shoppingListReducer } from "./reducers/shopping-list.reducer";
import { RecipesState, recipesReducer } from "./reducers/recipes.reducer";

export interface AppState {
  shoppingList: ShoppingListState;
  auth: AuthState;
  recipes: RecipesState;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: shoppingListReducer,
  auth: AuthReducer,
  recipes: recipesReducer,
}
