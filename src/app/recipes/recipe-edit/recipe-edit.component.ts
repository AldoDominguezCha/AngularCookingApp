import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/shared/store/app-state.interface';
import { Subscription, map } from 'rxjs';
import { RecipesState } from 'src/app/shared/store/reducers/recipes.reducer';
import { AddRecipe, UpdateRecipe } from 'src/app/shared/store/actions/recipes.generators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}
  recipeId: number;
  editMode: boolean = false;
  recipeForm: FormGroup;
  private recipeSubscription: Subscription = null;

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.recipeId = params.recipeId;
        this.editMode = params.recipeId !== undefined;

        this.initForm();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.recipeSubscription) {
      this.recipeSubscription.unsubscribe();
    }
  }

  private initForm() {
    const recipeInfo = {
      name: '',
      imageURL: '',
      description: '',
      ingredients: new FormArray([]),
    };

    if (this.editMode) {

      this.recipeSubscription = this.store.select('recipes').pipe(
        map((recipesState: RecipesState) => recipesState.recipes[this.recipeId])
      ).subscribe({
        next: (recipe: Recipe) => {

          recipeInfo.name = recipe.name;
          recipeInfo.imageURL = recipe.imageURL
          recipeInfo.description = recipe.description;

          if (recipe?.ingredients?.length && recipe?.ingredients?.length > 0) {
            for (let ingredient of recipe.ingredients) {
              recipeInfo.ingredients.push(new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
              }))
            }
          }
        }
      });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeInfo.name, Validators.required),
      'imageURL': new FormControl(recipeInfo.imageURL, Validators.required),
      'description': new FormControl(recipeInfo.description, Validators.required),
      'ingredients': recipeInfo.ingredients
    });
  }

  onSubmit() {

    if (this.editMode) {
      this.store.dispatch(new UpdateRecipe({ index: this.recipeId, recipe: this.recipeForm.value }));
    } else {
      this.store.dispatch(new AddRecipe(this.recipeForm.value));
    }
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  get ingredientControls() {
    return (<FormArray> this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onDeleteIngredientControl(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
