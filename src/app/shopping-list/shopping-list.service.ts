import { Subject } from 'rxjs';

import { Ingredient } from './../shared/ingredient.model';

export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Cheese', 150),
    new Ingredient('Basil', 20),
    new Ingredient('Pasta', 350),
  ];

  ingredientsSubject = new Subject<Ingredient[]>();
  startedEditingIngredient = new Subject<number>();

  getIngredients() {
    return [...this.ingredients];
  }

  getIngredientByIndex(idx: number) {
    return this.ingredients[idx];
  }

  addIngredient(newIngredient: Ingredient) {
    this.ingredients.push(newIngredient);
    this.ingredientsSubject.next([...this.ingredients]);
  }

  addMultipleIngredients(newIngredients: Ingredient[]) {
    this.ingredients = [...this.ingredients, ...newIngredients];
    this.ingredientsSubject.next([...this.ingredients]);
  }

  updateIngredientById(idx: number, name: string, amount: number) {
    this.ingredients[idx].name = name;
    this.ingredients[idx].amount = amount;
    this.ingredientsSubject.next([...this.ingredients]);
  }

  deleteIngredientById(idx: number) {
    this.ingredients.splice(idx, 1);
    this.ingredientsSubject.next([...this.ingredients]);
  }

}
