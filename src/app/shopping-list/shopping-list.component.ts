import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private ingredientsSubjectSubscription: Subscription = null;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsSubjectSubscription = this.shoppingListService.ingredientsSubject.subscribe((data: Ingredient[]) => {
      this.ingredients = data;
    });
  }

  ngOnDestroy(): void {
    this.ingredientsSubjectSubscription.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditingIngredient.next(index);
  }
}
