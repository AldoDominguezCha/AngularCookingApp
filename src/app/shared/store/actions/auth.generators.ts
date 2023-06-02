import { Action } from "@ngrx/store";
import { AUTHENTICATE_SUCCESS, AUTHENTICATE_FAIL, LOGIN_START, LOGOUT, SIGNUP_START, CLEAR_AUTHENTICATION_ERROR, AUTO_LOGIN } from "./action-types.contants";

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor(
    public payload: {
      email: string,
      userId: string,
      token: string,
      expirationDate: Date,
      redirect: boolean,
    }
  ) {}
}

export class LogOut implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: { email: string, password: string }) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: { email: string, password: string }) {}
}

export class CleanAuthenticationError implements Action {
  readonly type = CLEAR_AUTHENTICATION_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthAction =
  AuthenticateSuccess
  | LogOut
  | LoginStart
  | AuthenticateFail
  | SignupStart
  | CleanAuthenticationError
  | AutoLogin;

