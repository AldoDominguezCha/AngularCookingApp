import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/shared/store/app-state.interface';
import { RecipesState } from 'src/app/shared/store/reducers/recipes.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipesObs: Observable<RecipesState>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.recipesObs = this.store.select('recipes');
  }

  ngOnDestroy() {
  }

  onNewRecipeClick() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }
}
