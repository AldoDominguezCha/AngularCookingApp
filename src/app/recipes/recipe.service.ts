import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from "./recipe.model";
import { Ingredient } from '../shared/ingredient.model';
import { AddIngredients } from '../shared/store/actions/shopping-list.generators';
import { AppState } from '../shared/store/app-state.interface';

@Injectable({ providedIn: 'root' })
export class RecipeService {

  recipesSubject = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  /* private recipes: Recipe[] = [
    new Recipe(
      'Spaghetti',
      'Tasty spaghetti recipe!',
      'https://lilluna.com/wp-content/uploads/2018/05/easy-spaghetti-resize-2-800x640.jpg',
      [
        new Ingredient('Pasta', 300),
        new Ingredient('Basil', 50),
        new Ingredient('Butter', 30),
        new Ingredient('Tomato Sauce', 250)
      ],
    ),
    new Recipe(
      'Tiramisu',
      'Delicious tiramisu for dessert!',
      'https://bakeplaysmile.com/wp-content/uploads/2022/06/tiramisu-5.jpg',
      [
        new Ingredient('Sweet Bread', 300),
        new Ingredient('Chocolate', 200),
        new Ingredient('Cream', 15),
        new Ingredient('Egg', 80),
        new Ingredient('Coffee', 30)
      ],
    ),
    new Recipe(
        'Margherita Pizza',
        'Traditional margherita pizza recipe!',
        'https://images.ctfassets.net/nw5k25xfqsik/z5wDOVu5NTc9B9UR2gBPc/4e450952bb68f6a3b9a4a2def5cab877/20220211142645-margherita-9920.jpg?w=1024',
        [
          new Ingredient('Mozzarella Cheese', 200),
          new Ingredient('Tomato', 100),
          new Ingredient('Basil', 30),
          new Ingredient('Tomato Sauce', 200),
          new Ingredient('Pizza Dough', 300)
        ],
    ),
  ]; */

  constructor(
    private store: Store<AppState>
  ) {}

  getRecipes() {
    return [...this.recipes];
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesSubject.next([...this.recipes]);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new AddIngredients(ingredients));
  }

  getRecipeItemByIndex(recipeIndex: number): Recipe {
    if (recipeIndex >= this.recipes.length || recipeIndex < 0) return null;
    return {...this.recipes[recipeIndex]};
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesSubject.next([...this.recipes]);
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesSubject.next([...this.recipes]);
  }

  deleteRecipeByIndex(index: number) {
    this.recipes.splice(index, 1);
    this.recipesSubject.next([...this.recipes]);
  }
}
