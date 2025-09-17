export interface User {
  id: string;
  email: string;
  username: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  id: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  id: string;
  password: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}