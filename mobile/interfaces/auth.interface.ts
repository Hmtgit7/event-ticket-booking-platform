import type { Role } from "@/enums/role.enum";

/** Mirrors auth-service's AuthResponse (same shape as client/interfaces/auth.interface.ts). */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  userId: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  rolePromptSeen: boolean;
  /** "organizer" | "user" | null - which mode a dual-role account is currently using. */
  activePersona: "organizer" | "user" | null;
  roles: Role[];
}

/**
 * Mirrors auth-service's SignupResponse. accountCreated = false means a
 * Google-only account already existed for this email - no new account was
 * created, and `auth` is null. (Password-link email flow is web-only for
 * now - see mobile/README.md backlog.)
 */
export interface SignupResponse {
  accountCreated: boolean;
  auth: AuthResponse | null;
  message: string | null;
}

/** Authenticated profile payload from GET /auth/me. Mirrors auth-service's UserProfileResponse. */
export interface UserProfileResponse {
  userId: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  rolePromptSeen: boolean;
  hasPassword: boolean;
  activePersona: "organizer" | "user" | null;
  roles: Role[];
}

/** Mirrors auth-service's ErrorResponse. */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  code?: string;
}

export interface MessageResponse {
  message: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  wantsToOrganize: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

/** Decoded (not verified - decoding only) JWT claims, used client-side for UI/routing decisions only. */
export interface JwtClaims {
  sub: string;
  email: string;
  roles: Role[];
  emailVerified: boolean;
  exp: number;
  iat: number;
}
