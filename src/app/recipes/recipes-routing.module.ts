import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthenticationGuard } from "../shared/guards/auth-guard";
import { RecipesComponent } from "./recipes.component";
import { NoRecipeSelectedComponent } from "../no-recipe-selected/no-recipe-selected.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { recipeResolver } from "../shared/resolvers/recipe-resolver";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticationGuard],
    component: RecipesComponent,
    children: [
      {
        path: '',
        component: NoRecipeSelectedComponent
      },
      {
        path: 'new',
        component: RecipeEditComponent
      },
      {
        path: ':recipeId',
        component: RecipeDetailComponent,
        resolve: [recipeResolver]
      },
      {
        path: ':recipeId/edit',
        component: RecipeEditComponent,
        resolve: [recipeResolver]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {}
