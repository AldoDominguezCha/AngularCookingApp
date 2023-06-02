import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { getPasswordMinLengthValidator } from "../shared/customValidators/auth-form-validators";
import { PlaceholderDirective } from "../shared/directives/placeholder.directive";
import { AppState } from "../shared/store/app-state.interface";
import { CleanAuthenticationError, LoginStart, SignupStart } from "../shared/store/actions/auth.generators";
import { AuthState } from "../shared/store/reducers/auth.reducer";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  formMode: 'login' | 'signup' = 'login';
  authForm: FormGroup;
  isLoading = false;
  errorMessage: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertContainer: PlaceholderDirective;
  private authStateSubscription: Subscription = null;

  constructor(
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, getPasswordMinLengthValidator(6)])
    });

    this.authStateSubscription = this.authStateSubscription = this.store.select('auth')
      .subscribe({
        next: (authState: AuthState) => {
          this.isLoading = authState.loading;
          this.errorMessage = authState.authError;
        }
      });
  }

  ngOnDestroy(): void {
    this.authStateSubscription.unsubscribe();
  }

  onSwitchMode() {
    if (this.formMode === 'login') {
      this.formMode = 'signup';
    } else {
      this.formMode = 'login';
    }
  }

  onSubmit() {
    if (!this.authForm.valid) return;

    if (this.formMode === 'login') {
      this.store.dispatch(new LoginStart(this.authForm.value));
    } else {
      this.store.dispatch(new SignupStart(this.authForm.value));
    }
    this.authForm.reset();
  }

  onAlertClose() {
    this.store.dispatch(new CleanAuthenticationError());
  }
}
