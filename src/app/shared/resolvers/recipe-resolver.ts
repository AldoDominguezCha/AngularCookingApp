import { inject } from "@angular/core";
import { map, of, switchMap, take } from "rxjs";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { Recipe } from "src/app/recipes/recipe.model";
import { AppState } from "../store/app-state.interface";
import { FetchRecipes } from "../store/actions/recipes.generators";
import { SET_RECIPES } from "../store/actions/action-types.contants";
import { RecipesState } from "../store/reducers/recipes.reducer";

export const recipeResolver: ResolveFn<Recipe[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store<AppState>);
  const actions$ = inject(Actions);

  return store.select('recipes').pipe(
    take(1),
    map((recipesState: RecipesState) => recipesState.recipes),
    switchMap((recipes: Recipe[]) => {
      if (!!recipes && recipes.length > 0) {
        return of(recipes);
      } else {
        store.dispatch(new FetchRecipes());
        return actions$.pipe(
          ofType(SET_RECIPES),
          take(1)
        );
      }
    })
  )
}
