import { User } from "src/app/auth/user.model";
import { AuthAction } from "../actions/auth.generators";
import { AUTHENTICATE_FAIL, AUTHENTICATE_SUCCESS, CLEAR_AUTHENTICATION_ERROR, LOGIN_START, LOGOUT, SIGNUP_START } from "../actions/action-types.contants";

export interface AuthState {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState = {
  user: null,
  authError: null,
  loading: false,
};

export function AuthReducer(state = initialState, action: AuthAction) {
  switch(action.type) {
    case AUTHENTICATE_SUCCESS:
      const { email, userId, token, expirationDate } = action.payload;
      const user = new User(email, userId, token, expirationDate);
      return {
        ...state,
        user,
        authError: null,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
      }
    case LOGIN_START:
    case SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true,
      }
    case AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      }
    case CLEAR_AUTHENTICATION_ERROR:
      return {
        ...state,
        authError: null,
      }
    default:
      return {
        ...state
      }
  }
}
