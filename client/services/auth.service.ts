import { authApiClient } from "@/lib/api-client";
import type {
  AuthResponse,
  LoginPayload,
  SignupPayload,
  UserProfileResponse,
} from "@/interfaces/auth.interface";

/** Thin wrapper over auth-service's REST API. No business logic here - that lives in the hooks. */
export const authService = {
  signup: (payload: SignupPayload) =>
    authApiClient.post<AuthResponse>("/auth/signup", payload, { skipAuth: true }),

  login: (payload: LoginPayload) =>
    authApiClient.post<AuthResponse>("/auth/login", payload, { skipAuth: true }),

  adminLogin: (payload: LoginPayload) =>
    authApiClient.post<AuthResponse>("/auth/admin/login", payload, { skipAuth: true }),

  loginWithGoogle: (idToken: string) =>
    authApiClient.post<AuthResponse>("/auth/oauth2/google", { idToken }, { skipAuth: true }),

  refresh: (refreshToken: string) =>
    authApiClient.post<AuthResponse>("/auth/refresh", { refreshToken }, { skipAuth: true }),

  logout: (refreshToken: string) =>
    authApiClient.post<void>("/auth/logout", { refreshToken }, { skipAuth: true }),

  me: () => authApiClient.get<UserProfileResponse>("/auth/me"),

  verifyEmail: (token: string) =>
    authApiClient.post<{ message: string }>("/auth/verify-email", { token }, { skipAuth: true }),

  resendVerification: (email: string) =>
    authApiClient.post<{ message: string }>(
      "/auth/resend-verification",
      { email },
      { skipAuth: true },
    ),

  becomeOrganizer: () => authApiClient.post<AuthResponse>("/auth/roles/organizer"),
};
