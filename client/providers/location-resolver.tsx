"use client";

import { useEffect, useState } from "react";

import { LocationPermissionModal } from "@/components/common/location-permission-modal";
import { resolveWithGeolocation, resolveWithoutGeolocation } from "@/lib/location-resolution";
import { locationStorage, type StoredLocation } from "@/lib/location-storage";
import { preferencesService } from "@/services/preferences.service";
import { useAuthStore } from "@/store/auth-store";
import { useLocationStore } from "@/store/location-store";

/**
 * Runs once at the app root (marketing site AND dashboards): hydrates the
 * location store from localStorage immediately (no flash), then decides
 * whether to show the permission modal. Prompted at most once per browser
 * - see lib/location-storage's "prompted" flag - never on every page load,
 * and never re-shown just because a session ended.
 * <p>
 * For a logged-in user, auth-service's GLOBAL preference row is the real
 * source of truth (it can carry over across devices/browsers) - if it
 * already has an explicit country set, we trust it and skip the modal
 * entirely, even on a browser that's never been prompted before.
 */
export function LocationResolver() {
  const authUser = useAuthStore((state) => state.user);
  const isAuthHydrated = useAuthStore((state) => state.isHydrated);
  const setLocation = useLocationStore((state) => state.setLocation);
  const [modalOpen, setModalOpen] = useState(false);

  // Instant local hydration - runs regardless of auth state.
  useEffect(() => {
    const cached = locationStorage.get();
    if (cached) setLocation(cached);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reconcile with the backend (if logged in) and decide whether to prompt.
  useEffect(() => {
    if (!isAuthHydrated) return;

    if (!authUser) {
      // queueMicrotask defers this setState out of the effect's synchronous
      // execution path - react-hooks/set-state-in-effect only tracks real
      // useState setters (setModalOpen), not the zustand setLocation calls
      // elsewhere in this file, which is why only this branch needed it.
      if (!locationStorage.hasPrompted()) {
        queueMicrotask(() => setModalOpen(true));
      }
      return;
    }

    preferencesService
      .get("GLOBAL")
      .then((prefs) => {
        if (!prefs.countryInherited && prefs.country) {
          const resolved: StoredLocation = {
            country: prefs.country,
            timezone: prefs.timezone,
            language: prefs.language,
          };
          setLocation(resolved);
          locationStorage.set(resolved);
          locationStorage.markPrompted();
          return;
        }

        // Backend has no explicit country yet. If this browser already
        // resolved one as a guest (localStorage), this is exactly the
        // guest-resolves-before-signup case - sync it to the new account
        // now instead of leaving the preference unset with no further
        // prompt (hasPrompted() is already true from the guest session,
        // so the modal branch below would otherwise never fire again).
        const cached = locationStorage.get();
        if (cached?.country) {
          setLocation(cached);
          preferencesService
            .update({ language: cached.language, timezone: cached.timezone, country: cached.country })
            .catch(() => {
              // Best-effort - local cache already reflects it, next reconciliation pass can retry.
            });
          return;
        }

        if (!locationStorage.hasPrompted()) setModalOpen(true);
      })
      .catch(() => {
        if (!locationStorage.hasPrompted()) setModalOpen(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthHydrated, authUser]);

  async function persist(resolved: StoredLocation) {
    setLocation(resolved);
    locationStorage.set(resolved);
    locationStorage.markPrompted();

    if (authUser) {
      try {
        await preferencesService.update({
          language: resolved.language,
          timezone: resolved.timezone,
          ...(resolved.country ? { country: resolved.country } : {}),
        });
      } catch {
        // Best-effort - local cache already reflects it, a later reconciliation pass can retry.
      }
    }
  }

  async function handleAllow() {
    setModalOpen(false);
    persist(await resolveWithGeolocation());
  }

  async function handleDismiss() {
    setModalOpen(false);
    persist(await resolveWithoutGeolocation());
  }

  return <LocationPermissionModal open={modalOpen} onAllow={handleAllow} onDismiss={handleDismiss} />;
}
