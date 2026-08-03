import type { JwtClaims } from "@/interfaces/auth.interface";

/**
 * Decodes (does NOT verify) a JWT payload. Safe for client-side use because
 * this is only ever used for UI/routing decisions (which nav to show, which
 * route to redirect to) - every real authorization decision is enforced by
 * the backend re-verifying the token's signature. Never trust this decode
 * for anything security-sensitive.
 */
export function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

export function isTokenExpired(claims: Pick<JwtClaims, "exp">): boolean {
  return Date.now() >= claims.exp * 1000;
}
