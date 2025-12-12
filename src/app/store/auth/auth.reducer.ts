import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state, { email }) => ({
    ...state,
    currentUser: email,
    isAuthenticated: true
  })),
  on(AuthActions.logout, () => initialAuthState)
);