import api from "./api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const authService = {
  // Login and get JWT token
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Store token in localStorage
  setToken: (token: string): void => {
    localStorage.setItem("auth_token", token);
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },

  // Remove token (logout)
  removeToken: (): void => {
    localStorage.removeItem("auth_token");
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },
};
