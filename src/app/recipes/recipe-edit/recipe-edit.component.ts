import { Ingredient } from './../../shared/ingredient.model';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}
  recipeId: number;
  editMode: boolean = false;
  recipeForm: FormGroup;

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.recipeId = params.recipeId;
        this.editMode = params.recipeId !== undefined;

        this.initForm();
      }
    );
  }

  private initForm() {
    const recipeInfo = {
      name: '',
      imageURL: '',
      description: '',
      ingredients: new FormArray([]),
    };

    if (this.editMode) {
      const recipe: Recipe = this.recipeService.getRecipeItemByIndex(this.recipeId);

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

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeInfo.name, Validators.required),
      'imageURL': new FormControl(recipeInfo.imageURL, Validators.required),
      'description': new FormControl(recipeInfo.description, Validators.required),
      'ingredients': recipeInfo.ingredients
    });
  }

  onSubmit() {

    if (this.editMode) {
      this.recipeService.updateRecipe(this.recipeId, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
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
