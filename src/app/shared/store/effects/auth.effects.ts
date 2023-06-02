import { catchError, map, of, switchMap, tap } from "rxjs";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { Router } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AUTHENTICATE_SUCCESS, AUTO_LOGIN, LOGIN_START, LOGOUT, SIGNUP_START } from "../actions/action-types.contants";
import { AuthenticateFail, AuthenticateSuccess, LoginStart, SignupStart } from "../actions/auth.generators";
import { AuthResponse } from "src/app/auth/auth-response.interface";
import { environment } from "src/environments/environment";
import { User } from "src/app/auth/user.model";
import { AuthService } from "src/app/auth/auth.service";

@Injectable()
export class AuthEffects {

  private readonly firebaseToken = environment.firebaseAPIKey;
  private readonly firebaseAuthBaseURL = 'https://identitytoolkit.googleapis.com/v1/accounts';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  authLogin = createEffect(() => this.actions$
    .pipe(
      ofType(LOGIN_START),
      switchMap((authData: LoginStart) => {
        return this.http
          .post<AuthResponse>(
            `${this.firebaseAuthBaseURL}:signInWithPassword?key=${this.firebaseToken}`,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true
            },
            {
              observe: 'body',
            }
          )
          .pipe(
            tap((authData: AuthResponse) => {
              this.authService.setLogoutTimer(+authData.expiresIn * 1000);
            }),
            map((authData: AuthResponse) => this.handleAuthenticationSuccess(authData, true)),
            catchError(this.handleAuthenticationFail)
          );
      }),
    )
  );

  authSuccess = createEffect(() => this.actions$
      .pipe(
        ofType(AUTHENTICATE_SUCCESS),
        tap((authenticateSuccess: AuthenticateSuccess) => {
          if (authenticateSuccess.payload.redirect) {
            this.router.navigate(['/']);
          }
        })
      ),
      { dispatch: false }
  );

  authSignup = createEffect(() => this.actions$
    .pipe(
      ofType(SIGNUP_START),
      switchMap((signupAction: SignupStart) => {
        return this.http
          .post<AuthResponse>(
            `${this.firebaseAuthBaseURL}:signUp?key=${this.firebaseToken}`,
            { ...signupAction.payload, returnSecureToken: true },
            {
              observe: 'body',
            }
          ).pipe(
              tap((authData: AuthResponse) => {
                this.authService.setLogoutTimer(+authData.expiresIn * 1000);
              }),
              map((authData: AuthResponse) => this.handleAuthenticationSuccess(authData, true)),
              catchError(this.handleAuthenticationFail)
          )
      })
    )
  );

  authLogout = createEffect(() => this.actions$
    .pipe(
      ofType(LOGOUT),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/', 'auth']);
      })
    ),
    { dispatch: false }
  );

  autoLogin = createEffect(() => this.actions$
    .pipe(
      ofType(AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) return { type: 'NO_USER_IN_LOCAL_STORAGE' };

        const {
          email,
          id: userId,
          _token: token,
          _tokenExpirationDate,
        } = userData;

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const duration: number = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(duration);
          return new AuthenticateSuccess({ email, userId, token, expirationDate: new Date(_tokenExpirationDate), redirect: false });
        }

        return { type: 'NO_USER_IN_LOCAL_STORAGE' };
      })
    ),
  )

  private handleAuthenticationSuccess(authData: AuthResponse, redirect: boolean) {
    const { email, localId: userId, idToken: token, expiresIn } = authData;
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthenticateSuccess({
      email,
      userId,
      token,
      expirationDate,
      redirect,
    });
  }

  private handleAuthenticationFail(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (!error.error?.error) return of(new AuthenticateFail(errorMessage));

    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The provided email is already taken.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'The operation is not allowed.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'The email could not be found.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The provided password is incorrect.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user is disabled.';
        break;
      default:
        errorMessage = 'Something went wrong!';
        break;
    }

    return of(new AuthenticateFail(errorMessage));
  }

}

