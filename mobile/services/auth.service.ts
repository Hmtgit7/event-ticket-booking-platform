import { authApiClient } from "@/lib/api-client";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  ResetPasswordPayload,
  SignupPayload,
  SignupResponse,
  UserProfileResponse,
} from "@/interfaces/auth.interface";

/**
 * Thin wrapper over auth-service's REST API. No business logic here - that
 * lives in hooks/store. Mirrors client/services/auth.service.ts, trimmed to
 * the flows the mobile app needs first (password change, Google OAuth
 * bridge, and organizer role upgrade stay web-only for now - see
 * mobile/README.md backlog).
 */
export const authService = {
  signup: (payload: SignupPayload) =>
    authApiClient.post<SignupResponse>("/auth/signup", payload, { skipAuth: true }),

  login: (payload: LoginPayload) =>
    authApiClient.post<AuthResponse>("/auth/login", payload, { skipAuth: true }),

  refresh: (refreshToken: string) =>
    authApiClient.post<AuthResponse>("/auth/refresh", { refreshToken }, { skipAuth: true }),

  logout: (refreshToken: string) =>
    authApiClient.post<void>("/auth/logout", { refreshToken }, { skipAuth: true }),

  me: () => authApiClient.get<UserProfileResponse>("/auth/me"),

  verifyEmail: (token: string) =>
    authApiClient.post<AuthResponse>("/auth/verify-email", { token }, { skipAuth: true }),

  resendVerification: (email: string) =>
    authApiClient.post<MessageResponse>("/auth/resend-verification", { email }, { skipAuth: true }),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    authApiClient.post<MessageResponse>("/auth/forgot-password", payload, { skipAuth: true }),

  resetPassword: (payload: ResetPasswordPayload) =>
    authApiClient.post<AuthResponse>("/auth/reset-password", payload, { skipAuth: true }),
};
