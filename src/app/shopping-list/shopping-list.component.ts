import { Observable } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../shared/store/app-state.interface';
import { StartIngredientEdit } from '../shared/store/actions/shopping-list.generators';
import { ShoppingListState } from '../shared/store/reducers/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<ShoppingListState>;

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  ngOnDestroy(): void {
  }

  onEditItem(index: number) {
    this.store.dispatch(new StartIngredientEdit(index));
  }
}
