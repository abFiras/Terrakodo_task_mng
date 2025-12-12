export interface AuthState {
  currentUser: string | null;
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  currentUser: null,
  isAuthenticated: false
};