import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { AddIngredient, DeleteIngredient, UpdateIngredient } from 'src/app/shared/store/actions/shopping-list.generators';
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
  editedItemIndex: number = null;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.editingIngredientSubscription = this.shoppingListService.startedEditingIngredient
      .subscribe((index : number) => {
        this.editedItemIndex = index;
        this.editMode = true;

        const editingIngredient = this.shoppingListService.getIngredientByIndex(index);
        this.ingredientForm.setValue({
          name: editingIngredient.name,
          amount: editingIngredient.amount,
        });
    })
  }

  ngOnDestroy(): void {
    this.editingIngredientSubscription.unsubscribe();
  }

  onSubmit() {
    const { name, amount } = this.ingredientForm.value;

    if (this.editMode) {
      this.store.dispatch(new UpdateIngredient({id: this.editedItemIndex, ingredient: {name, amount}}));
      this.editMode = false;
      this.editedItemIndex = null;
    } else {
      this.store.dispatch(new AddIngredient({ name, amount }));
    }
    this.ingredientForm.reset();
  }

  onClear() {
    this.editMode = false;
    this.editedItemIndex = null;
    this.ingredientForm.reset();
  }

  onDelete() {
    this.store.dispatch(new DeleteIngredient(this.editedItemIndex));
    this.onClear();
  }
}
