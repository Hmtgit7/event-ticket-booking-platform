import { authApiClient } from "@/lib/api-client";
import type {
  AuthResponse,
  ChangePasswordPayload,
  LinkPasswordConfirmPayload,
  LoginPayload,
  MessageResponse,
  ResetPasswordPayload,
  SignupPayload,
  SignupResponse,
  UserProfileResponse,
} from "@/interfaces/auth.interface";

/** Thin wrapper over auth-service's REST API. No business logic here - that lives in the hooks. */
export const authService = {
  signup: (payload: SignupPayload) =>
    authApiClient.post<SignupResponse>("/auth/signup", payload, { skipAuth: true }),

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
    authApiClient.post<MessageResponse>("/auth/verify-email", { token }, { skipAuth: true }),

  resendVerification: (email: string) =>
    authApiClient.post<MessageResponse>(
      "/auth/resend-verification",
      { email },
      { skipAuth: true },
    ),

  becomeOrganizer: () => authApiClient.post<AuthResponse>("/auth/roles/organizer"),

  /** Explicit Organizer <-> Customer switch, persisted server-side for this account. */
  updatePersona: (persona: "organizer" | "user") =>
    authApiClient.patch<UserProfileResponse>("/auth/me/persona", { persona }),

  dismissRolePrompt: () => authApiClient.post<MessageResponse>("/auth/role-prompt/dismiss"),

  /** Google-only account confirming password link, from the email sent during a colliding signup. */
  confirmLinkPassword: (payload: LinkPasswordConfirmPayload) =>
    authApiClient.post<AuthResponse>("/auth/link-password/confirm", payload, { skipAuth: true }),

  forgotPassword: (email: string) =>
    authApiClient.post<MessageResponse>("/auth/forgot-password", { email }, { skipAuth: true }),

  resetPassword: (payload: ResetPasswordPayload) =>
    authApiClient.post<AuthResponse>("/auth/reset-password", payload, { skipAuth: true }),

  changePassword: (payload: ChangePasswordPayload) =>
    authApiClient.post<MessageResponse>("/auth/change-password", payload),
};
