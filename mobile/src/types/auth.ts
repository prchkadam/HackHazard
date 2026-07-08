import type { User } from '@/types/user';

export interface AuthTokens {
  token: string;
}

export interface GoogleLoginPayload {
  idToken: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (idToken: string) => Promise<void>;
  loginGuest: () => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}
