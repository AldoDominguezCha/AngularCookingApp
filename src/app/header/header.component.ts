import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../shared/store/app-state.interface';
import { AuthState } from '../shared/store/reducers/auth.reducer';
import { LogOut } from '../shared/store/actions/auth.generators';
import { FetchRecipes, StoreRecipes } from '../shared/store/actions/recipes.generators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  authSubscription: Subscription = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth').subscribe({
      next: (authState: AuthState) => {
        this.isAuthenticated = !!authState.user;
      }
    })
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onSaveRecipes() {
    this.store.dispatch(new StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new LogOut());
  }

}
