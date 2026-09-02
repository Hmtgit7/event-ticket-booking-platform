import { create } from "zustand";

import { decodeJwt, isTokenExpired } from "@/lib/jwt";
import { refreshAccessToken } from "@/lib/refresh-token";
import { tokenStorage } from "@/lib/token-storage";
import { authService } from "@/services/auth.service";
import type { AuthResponse, UserProfileResponse } from "@/interfaces/auth.interface";
import type { Role } from "@/enums/role.enum";

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roles: Role[];
  emailVerified: boolean;
  activePersona: "organizer" | "user" | null;
}

interface AuthState {
  user: AuthUser | null;
  /** True once we've checked SecureStore on app load - prevents a flash of "logged out" UI. */
  isHydrated: boolean;
  setSession: (auth: AuthResponse) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
}

function toAuthUser(auth: AuthResponse | UserProfileResponse): AuthUser {
  return {
    id: auth.userId,
    email: auth.email,
    fullName: auth.fullName,
    roles: auth.roles,
    emailVerified: auth.emailVerified,
    activePersona: auth.activePersona,
  };
}

/**
 * Mirrors client/store/auth-store.ts. Two structural differences from the
 * web version: setSession/clearSession are async (SecureStore persistence
 * isn't synchronous like js-cookie), and there's no cross-tab persona
 * broadcast - mobile has no concept of multiple open tabs.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,

  async setSession(auth) {
    await tokenStorage.setTokens(auth.accessToken, auth.refreshToken);
    set({ user: toAuthUser(auth), isHydrated: true });
  },

  async clearSession() {
    await tokenStorage.clear();
    set({ user: null, isHydrated: true });
  },

  async hydrate() {
    const { accessToken } = await tokenStorage.loadPersisted();
    const claims = accessToken ? decodeJwt(accessToken) : null;

    // Access token missing/expired - try a silent refresh using the refresh
    // token before giving up, same as the web client's hydrate().
    let liveAccessToken: string | null = accessToken;
    let liveClaims = claims;
    if (!claims || isTokenExpired(claims)) {
      liveAccessToken = await refreshAccessToken();
      liveClaims = liveAccessToken ? decodeJwt(liveAccessToken) : null;
    }

    if (!liveAccessToken || !liveClaims) {
      await tokenStorage.clear();
      set({ user: null, isHydrated: true });
      return;
    }

    const claimUser: AuthUser = {
      id: liveClaims.sub,
      email: liveClaims.email,
      fullName: "",
      roles: liveClaims.roles,
      emailVerified: liveClaims.emailVerified,
      activePersona: null,
    };

    set({ user: claimUser, isHydrated: true });

    try {
      const profile = await authService.me();
      set({ user: toAuthUser(profile), isHydrated: true });
    } catch {
      await tokenStorage.clear();
      set({ user: null, isHydrated: true });
    }
  },
}));
