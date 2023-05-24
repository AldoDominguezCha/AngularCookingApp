import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  private recipesSubscription: Subscription = null;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();

    this.recipesSubscription = this.recipeService.recipesSubject.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    })
  }

  ngOnDestroy() {
    this.recipesSubscription.unsubscribe();
  }

  onNewRecipeClick() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }
}
