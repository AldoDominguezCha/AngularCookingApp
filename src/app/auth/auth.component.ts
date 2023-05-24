import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { getPasswordMinLengthValidator } from "../shared/customValidators/auth-form-validators";
import { AuthService } from "./auth.service";
import { AuthResponse } from "./auth-response.interface";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
//import { AlertComponent } from "../shared/components/alert/alert.component";
import { PlaceholderDirective } from "../shared/directives/placeholder.directive";

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
  //private closeAlertSubscription: Subscription = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    //private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, getPasswordMinLengthValidator(6)])
    });
  }

  /* ngOnDestroy(): void {
    if (this.closeAlertSubscription)
      this.closeAlertSubscription.unsubscribe();
  } */

  onSwitchMode() {
    if (this.formMode === 'login') {
      this.formMode = 'signup';
    } else {
      this.formMode = 'login';
    }
  }

  onSubmit() {
    if (!this.authForm.valid) return;

    const authObservable: Observable<AuthResponse> = this.formMode === 'signup'
      ? this.authService.signUp(this.authForm.value)
      : this.authService.logIn(this.authForm.value);

    this.isLoading = true;

    authObservable.subscribe({
      next: (authData: AuthResponse) => {
        this.errorMessage = null;
        this.router.navigate(['/']);
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        //this.showErrorAlert(error.message);
      },
    })
    .add(() => this.isLoading = false);

    this.authForm.reset();
  }

  onAlertClose() {
    this.errorMessage = null;
  }

  /* private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const containerViewContainerRef = this.alertContainer.viewContainerRef;
    containerViewContainerRef.clear();

    const alertCmpRef = containerViewContainerRef.createComponent(alertCmpFactory);
    alertCmpRef.instance.message = message;
    this.closeAlertSubscription = alertCmpRef.instance.closeAlert.subscribe(() => {
      this.closeAlertSubscription.unsubscribe();
      containerViewContainerRef.clear();
    });
  } */
}
