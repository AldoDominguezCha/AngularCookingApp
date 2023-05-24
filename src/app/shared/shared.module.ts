import { NgModule } from "@angular/core";
import { AlertComponent } from "./components/alert/alert.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner.component";
import { PlaceholderDirective } from "./directives/placeholder.directive";
import { DropdownDirective } from "./dropdown.directive";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective
  ],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule {}
