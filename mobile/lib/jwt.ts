import type { JwtClaims } from "@/interfaces/auth.interface";

/**
 * Minimal base64url decoder with no dependency on `atob` - Hermes (RN's JS
 * engine) does not provide the browser's atob/btoa globals, unlike web
 * browsers where client/lib/jwt.ts can rely on them directly.
 */
const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

  let output = "";
  let buffer = 0;
  let bitsCollected = 0;

  for (const char of padded) {
    if (char === "=") break;
    const value = BASE64_CHARS.indexOf(char);
    if (value === -1) continue;
    buffer = (buffer << 6) | value;
    bitsCollected += 6;
    if (bitsCollected >= 8) {
      bitsCollected -= 8;
      output += String.fromCharCode((buffer >> bitsCollected) & 0xff);
    }
  }

  return output;
}

/**
 * Decodes (does NOT verify) a JWT payload. Safe for client-side use because
 * this is only ever used for UI/routing decisions (which screen to show,
 * which route to redirect to) - every real authorization decision is
 * enforced by the backend re-verifying the token's signature. Never trust
 * this decode for anything security-sensitive.
 */
export function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split(".")[1];
    const json = decodeURIComponent(
      base64UrlDecode(payload)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

export function isTokenExpired(claims: Pick<JwtClaims, "exp">): boolean {
  return Date.now() >= claims.exp * 1000;
}
