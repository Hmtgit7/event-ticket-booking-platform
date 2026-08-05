import { create } from "zustand";

import { decodeJwt, isTokenExpired } from "@/lib/jwt";
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
  rolePromptSeen: boolean;
}

interface AuthState {
  user: AuthUser | null;
  /** True once we've checked the stored cookie on app load - prevents a flash of "logged out" UI. */
  isHydrated: boolean;
  setSession: (auth: AuthResponse) => void;
  clearSession: () => void;
  hydrate: () => Promise<void>;
  /** Optimistic local update after dismissing the "also host events?" prompt - avoids a round trip before navigating. */
  markRolePromptSeen: () => void;
}

function toAuthUser(auth: AuthResponse | UserProfileResponse): AuthUser {
  return {
    id: auth.userId,
    email: auth.email,
    fullName: auth.fullName,
    roles: auth.roles,
    emailVerified: auth.emailVerified,
    rolePromptSeen: auth.rolePromptSeen,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,

  setSession(auth) {
    tokenStorage.setTokens(auth.accessToken, auth.refreshToken, auth.expiresIn);
    set({ user: toAuthUser(auth), isHydrated: true });
  },

  clearSession() {
    tokenStorage.clear();
    set({ user: null, isHydrated: true });
  },

  markRolePromptSeen() {
    set((state) => (state.user ? { user: { ...state.user, rolePromptSeen: true } } : state));
  },

  async hydrate() {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      set({ user: null, isHydrated: true });
      return;
    }

    const claims = decodeJwt(accessToken);
    if (!claims || isTokenExpired(claims)) {
      // Access token dead, but a refresh token might still be alive - the API
      // client will silently refresh on the next authenticated request.
      set({ user: null, isHydrated: true });
      return;
    }

    const claimUser: AuthUser = {
      id: claims.sub,
      email: claims.email,
      fullName: "",
      roles: claims.roles,
      emailVerified: claims.emailVerified,
      // Not in the JWT claims (kept minimal) - refined below once /auth/me resolves.
      rolePromptSeen: true,
    };

    set({ user: claimUser, isHydrated: true });

    try {
      const profile = await authService.me();
      set({ user: toAuthUser(profile), isHydrated: true });
    } catch {
      tokenStorage.clear();
      set({ user: null, isHydrated: true });
    }
  },
}));
