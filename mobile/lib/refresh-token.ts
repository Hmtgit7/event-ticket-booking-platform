import { env } from "@/lib/env";
import { tokenStorage } from "@/lib/token-storage";
import type { AuthResponse } from "@/interfaces/auth.interface";

let inFlightRefresh: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const res = await fetch(`${env.authApiUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    await tokenStorage.clear();
    return null;
  }

  const data = (await res.json()) as AuthResponse;
  await tokenStorage.setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

/**
 * De-duplicates concurrent refresh attempts. If three API calls (to auth-,
 * event-, and booking-service) all hit a 401 at once, only ONE /auth/refresh
 * request is made - mirrors client/lib/refresh-token.ts exactly.
 */
export function refreshAccessToken(): Promise<string | null> {
  if (!inFlightRefresh) {
    inFlightRefresh = performRefresh().finally(() => {
      inFlightRefresh = null;
    });
  }
  return inFlightRefresh;
}
