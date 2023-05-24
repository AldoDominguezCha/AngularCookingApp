import { catchError, tap, throwError, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AuthResponse } from './auth-response.interface';
import { User } from './user.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userSubject = new BehaviorSubject<User>(null);
  private tokenExpirationTimerRef: any = null;

  private readonly firebaseToken = environment.firebaseAPIKey;
  private readonly firebaseAuthBaseURL =
    'https://identitytoolkit.googleapis.com/v1/accounts';

  constructor(private http: HttpClient, private router: Router) {}

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.userSubject.next(loadedUser);
      const duration: number = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(duration);
    } else {
      localStorage.removeItem('userData');
    }
  }

  autoLogout(tokenDurationInMiliseconds : number) {
    this.tokenExpirationTimerRef = setTimeout(() => {
      this.logOut();
    }, tokenDurationInMiliseconds);
  }

  signUp(signUpBody: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>(
        `${this.firebaseAuthBaseURL}:signUp?key=${this.firebaseToken}`,
        { ...signUpBody, returnSecureToken: true },
        {
          observe: 'body',
        }
      )
      .pipe(
        catchError(this.handleRequestError),
        tap((authData: AuthResponse) => {
          this.emitAuthenticatedUser(authData);
        })
      );
  }

  logIn(logInBody: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>(
        `${this.firebaseAuthBaseURL}:signInWithPassword?key=${this.firebaseToken}`,
        { ...logInBody, returnSecureToken: true },
        {
          observe: 'body',
        }
      )
      .pipe(
        catchError(this.handleRequestError),
        tap((authData: AuthResponse) => {
          this.emitAuthenticatedUser(authData);
        })
      );
  }

  logOut() {
    localStorage.removeItem('userData');
    this.userSubject.next(null);
    this.router.navigate(['/', 'auth']);
    if (this.tokenExpirationTimerRef) {
      clearTimeout(this.tokenExpirationTimerRef);
    }
    this.tokenExpirationTimerRef = null;
  }

  private handleRequestError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (!error.error?.error) return throwError(() => new Error(errorMessage));

    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The provided email is already in use.';
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

    return throwError(() => new Error(errorMessage));
  }

  private emitAuthenticatedUser(authData: AuthResponse) {
    const expirationDate = new Date(
      new Date().getTime() + +authData.expiresIn * 1000
    );
    const user = new User(
      authData.email,
      authData.localId,
      authData.idToken,
      expirationDate
    );
    this.autoLogout(+authData.expiresIn*1000);
    this.userSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
