import { map, switchMap, tap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import { DELETE_RECIPE, FETCH_RECIPES, STORE_RECIPES } from "../actions/action-types.contants";
import { firebaseBaseURL } from "../../constants";
import { Recipe } from "src/app/recipes/recipe.model";
import { SetRecipes } from "../actions/recipes.generators";
import { AppState } from "../app-state.interface";

@Injectable()
export class RecipesEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private store: Store<AppState>
  ) {}

  fetchRecipes = createEffect(() => this.actions$
    .pipe(
      ofType(FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(`${firebaseBaseURL}/recipes.json`, { observe: 'body' })
      }),
      map((recipes: Recipe[]) => recipes.map(recipe => ({
        ...recipe,
        ingredients: recipe.ingredients ? recipe.ingredients : [],
      }))),
      map((recipes: Recipe[]) => new SetRecipes(recipes))
    )
  );

  deleteRecipe = createEffect(() => this.actions$
    .pipe(
      ofType(DELETE_RECIPE),
      tap(() => {
        this.router.navigate(['/', 'recipes']);
      })
    ),
    { dispatch: false }
  );

  storeRecipes = createEffect(() => this.actions$
    .pipe(
      ofType(STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) => {
        return this.http.put(`${firebaseBaseURL}/recipes.json`, recipesState.recipes);
      })
    ),
    { dispatch: false }
  );
}
