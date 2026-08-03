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
  roles: Role[];
}

/** Authenticated profile payload from GET /auth/me. */
export type UserProfileResponse = Pick<
  AuthResponse,
  "userId" | "email" | "fullName" | "emailVerified" | "roles"
>;

/** Mirrors auth-service's ErrorResponse. */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
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

/** Decoded (not verified - decoding only) JWT claims, used client-side for UI/routing decisions only. */
export interface JwtClaims {
  sub: string;
  email: string;
  roles: Role[];
  emailVerified: boolean;
  exp: number;
  iat: number;
}
