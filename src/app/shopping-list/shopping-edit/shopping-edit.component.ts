import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';

import { AddIngredient, DeleteIngredient, StopIngredientEdit, UpdateIngredient } from 'src/app/shared/store/actions/shopping-list.generators';
import { ShoppingListState } from 'src/app/shared/store/reducers/shopping-list.reducer';
import { AppState } from 'src/app/shared/store/app-state.interface';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('ingredientForm', { static: false }) ingredientForm: NgForm;
  editingIngredientSubscription: Subscription = null;
  editMode = false;

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {

    this.editingIngredientSubscription = this.store.select('shoppingList')
      .pipe(
        map(({ editedIngredient, editedIngredientIndex }: ShoppingListState) => ({ editedIngredient, editedIngredientIndex }))
      ).subscribe({
        next: ({ editedIngredientIndex, editedIngredient }) => {
          if ((editedIngredientIndex !== null) && !!editedIngredient) {
            this.editMode = true;

            this.ingredientForm.setValue({
              name: editedIngredient.name,
              amount: editedIngredient.amount
            });
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.editingIngredientSubscription.unsubscribe();
    this.store.dispatch(new StopIngredientEdit());
  }

  onSubmit() {
    const { name, amount } = this.ingredientForm.value;

    if (this.editMode) {
      this.store.dispatch(new UpdateIngredient({name, amount}));
      this.editMode = false;
    } else {
      this.store.dispatch(new AddIngredient({ name, amount }));
    }
    this.ingredientForm.reset();
  }

  onClear() {
    this.editMode = false;
    this.ingredientForm.reset();
    this.store.dispatch(new StopIngredientEdit());
  }

  onDelete() {
    this.store.dispatch(new DeleteIngredient());
    this.onClear();
  }
}
