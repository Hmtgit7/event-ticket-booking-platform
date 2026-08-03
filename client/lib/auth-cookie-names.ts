/**
 * Shared between lib/token-storage.ts (browser, via js-cookie) and
 * middleware.ts (Edge runtime, via NextRequest.cookies) - kept separate so
 * middleware never has to import js-cookie/document-dependent code.
 */
export const ACCESS_TOKEN_COOKIE = "gmt_access_token";
export const REFRESH_TOKEN_COOKIE = "gmt_refresh_token";
