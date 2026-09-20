const LOCATION_KEY = "gmt_location";
const PROMPTED_KEY = "gmt_location_prompted";

export interface StoredLocation {
  country: string | null;
  timezone: string;
  language: string;
}

/**
 * Guest-facing cache of the resolved {country, timezone, language} triple,
 * plus a one-time "have we already shown the permission modal" flag so we
 * never re-prompt a returning visitor. Deliberately plain localStorage, not
 * a cookie like token-storage.ts - this never needs to be read by Next.js
 * middleware on the Edge, only by client components.
 * <p>
 * For a logged-in user this is a fallback/cache in front of the real
 * source of truth (auth-service's GLOBAL preference row, see
 * preferences.service.ts) - see location-resolver.tsx for how the two
 * are reconciled.
 */
export const locationStorage = {
  get(): StoredLocation | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(LOCATION_KEY);
      return raw ? (JSON.parse(raw) as StoredLocation) : null;
    } catch {
      return null;
    }
  },

  set(location: StoredLocation) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    } catch {
      // localStorage unavailable (private browsing, quota) - non-fatal, just means we re-resolve next visit.
    }
  },

  hasPrompted(): boolean {
    if (typeof window === "undefined") return true; // SSR: never prompt
    try {
      return window.localStorage.getItem(PROMPTED_KEY) === "true";
    } catch {
      return true;
    }
  },

  markPrompted() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PROMPTED_KEY, "true");
    } catch {
      // non-fatal
    }
  },
};
