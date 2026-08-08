import type { Role } from "@/enums/role.enum";

/** Mirrors auth-service's AuthResponse. */
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
  /** "organizer" | "user" | null - which mode a dual-role account is currently using. Server-side, see auth-service's User.activePersona. */
  activePersona: "organizer" | "user" | null;
  roles: Role[];
}

/**
 * Mirrors auth-service's SignupResponse. accountCreated = false means a
 * Google-only account already existed for this email - no new account was
 * created, a link-password email was sent instead, and `auth` is null.
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
  /** Stable machine-readable identifier for cases the frontend branches on
   *  (e.g. "EMAIL_NOT_VERIFIED") - absent/undefined for everything else. */
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

export interface LinkPasswordConfirmPayload {
  token: string;
  newPassword: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

/** currentPassword is omitted entirely when the account has no password yet (see hasPassword above). */
export interface ChangePasswordPayload {
  currentPassword?: string;
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
