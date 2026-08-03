"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";

/**
 * Runs once on app load: reads the access-token cookie (if any) and populates
 * the zustand auth store, so a page refresh doesn't show a flash of
 * "logged out" state before the cookie is checked.
 */
export function AuthHydrator() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
    // Only run once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
