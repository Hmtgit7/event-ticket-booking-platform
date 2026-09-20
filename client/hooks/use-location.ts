"use client";

import { locationStorage } from "@/lib/location-storage";
import { preferencesService } from "@/services/preferences.service";
import { useAuthStore } from "@/store/auth-store";
import { useLocationStore } from "@/store/location-store";

/**
 * Single place anything that lets a person change their country should go
 * through - keeps the zustand store (what components render), the
 * localStorage cache (what a guest gets instantly on their next visit),
 * and the backend GLOBAL preference (what a logged-in person gets synced
 * across devices) all in agreement. See providers/location-resolver.tsx
 * for the initial resolution flow this builds on.
 */
export function useLocation() {
  const country = useLocationStore((state) => state.country);
  const timezone = useLocationStore((state) => state.timezone);
  const language = useLocationStore((state) => state.language);
  const setLocationState = useLocationStore((state) => state.setLocation);
  const authUser = useAuthStore((state) => state.user);

  async function setCountry(code: string) {
    const next = { country: code, timezone, language };
    setLocationState(next);
    locationStorage.set(next);
    locationStorage.markPrompted();

    if (authUser) {
      try {
        await preferencesService.update({ country: code });
      } catch {
        // Best-effort - local state already reflects the change; next reconciliation pass can retry the sync.
      }
    }
  }

  return { country, timezone, language, setCountry };
}
