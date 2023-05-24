import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import DataStorageService from "../data-storage.service";
import { Recipe } from "src/app/recipes/recipe.model";
import { RecipeService } from "src/app/recipes/recipe.service";

export const recipeResolver: ResolveFn<Recipe[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const recipes = inject(RecipeService).getRecipes();

  if (recipes.length < 1) {
    return inject(DataStorageService).fetchRecipes();
  }
}
