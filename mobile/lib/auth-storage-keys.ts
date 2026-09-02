/**
 * Shared between lib/token-storage.ts and anywhere else that needs to read
 * these keys - kept separate for the same reason as client's
 * auth-cookie-names.ts: a single source of truth for the key strings.
 */
export const ACCESS_TOKEN_KEY = "gmt_access_token";
export const REFRESH_TOKEN_KEY = "gmt_refresh_token";
