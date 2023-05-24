import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from './../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeItem: Recipe = null;
  recipeId: number;

  constructor(
    private recipeService: RecipeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.recipeId = parseInt(params.recipeId);
        this.recipeItem = this.recipeService.getRecipeItemByIndex(this.recipeId);
      }
    )
  }

  onAddSelectedIngredientsToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipeItem.ingredients);
  }

  onRecipeDelete() {
    this.recipeService.deleteRecipeByIndex(this.recipeId);
    this.router.navigate(['/recipes']);
  }

}