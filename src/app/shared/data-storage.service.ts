import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { firebaseBaseURL } from "./constants";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: 'root' })
export default class DataStorageService {

  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
  ) {}

  saveRecipes() {
    const recipes: Recipe[] = this.recipesService.getRecipes();
    return this.http.put(`${firebaseBaseURL}/recipes.json`, recipes);
  }

  fetchRecipes() {
      return this.http.get<Recipe[]>(`${firebaseBaseURL}/recipes.json`, { observe: 'body' })
      .pipe(
        map((recipes: Recipe[], idx: number) => recipes.map(recipe => ({
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        }))),
        tap(recipes => this.recipesService.setRecipes(recipes))
      );
  }
}
