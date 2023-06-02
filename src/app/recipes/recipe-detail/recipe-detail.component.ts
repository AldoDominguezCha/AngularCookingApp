import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/shared/store/app-state.interface';
import { map, switchMap } from 'rxjs';
import { RecipesState } from 'src/app/shared/store/reducers/recipes.reducer';
import { DeleteRecipe } from 'src/app/shared/store/actions/recipes.generators';
import { AddIngredients } from 'src/app/shared/store/actions/shopping-list.generators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeItem: Recipe = null;
  recipeId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap((params: Params) => {
        this.recipeId = +params.recipeId;
        return this.store.select('recipes').pipe(
          map((recipesState: RecipesState) => recipesState.recipes[this.recipeId])
        )
      })
    ).subscribe((recipe: Recipe) => this.recipeItem = {...recipe});
  }

  onAddSelectedIngredientsToShoppingList() {
    this.store.dispatch(new AddIngredients(this.recipeItem.ingredients));
  }

  onRecipeDelete() {
    this.store.dispatch(new DeleteRecipe(this.recipeId));
  }

}
