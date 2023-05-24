import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

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

  constructor(private shoppingListService: ShoppingListService) {}

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
      this.shoppingListService.updateIngredientById(this.editedItemIndex, name, amount);
      this.editMode = false;
      this.editedItemIndex = null;
    } else {
      this.shoppingListService.addIngredient(new Ingredient(name, amount));
    }
    this.ingredientForm.reset();
  }

  onClear() {
    this.editMode = false;
    this.editedItemIndex = null;
    this.ingredientForm.reset();
  }

  onDelete() {
    this.shoppingListService.deleteIngredientById(this.editedItemIndex);
    this.onClear();
  }
}
