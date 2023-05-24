import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import DataStorageService from '../shared/data-storage.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userAuthSubscription: Subscription = null;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
    ) {}

  ngOnInit(): void {
    this.userAuthSubscription = this.authService.userSubject.subscribe({
      next: (user: User) => {
        this.isAuthenticated = !!user;
      }
    })
  }

  ngOnDestroy(): void {
    this.userAuthSubscription.unsubscribe();
  }

  onSaveRecipes() {
    this.dataStorageService.saveRecipes().subscribe(response => {
      console.log('RECIPES SAVED. RESPONSE IS', response);
    });
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logOut();
  }

}
