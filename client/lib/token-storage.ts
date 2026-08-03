import Cookies from "js-cookie";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth-cookie-names";

/**
 * Tokens live in plain (non-httpOnly) cookies, not localStorage - Next.js
 * middleware runs on the Edge and can only read the Cookie header, not
 * localStorage. Trade-off: readable by JS (XSS risk), same as localStorage
 * would be. Real security enforcement is server-side regardless; a future
 * hardening step would move to a BFF pattern with httpOnly cookies.
 */
const REFRESH_TOKEN_DAYS = 7; // matches JWT_REFRESH_TOKEN_TTL default on auth-service

const cookieOptions = { sameSite: "lax" as const, secure: process.env.NODE_ENV === "production" };

export const tokenStorage = {
  getAccessToken: () => Cookies.get(ACCESS_TOKEN_COOKIE) ?? null,
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_COOKIE) ?? null,

  setTokens(accessToken: string, refreshToken: string, expiresInSeconds: number) {
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      ...cookieOptions,
      expires: expiresInSeconds / 86_400, // js-cookie expects days
    });
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...cookieOptions,
      expires: REFRESH_TOKEN_DAYS,
    });
  },

  clear() {
    Cookies.remove(ACCESS_TOKEN_COOKIE);
    Cookies.remove(REFRESH_TOKEN_COOKIE);
  },
};
