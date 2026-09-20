import { create } from "zustand";
import type { StoredLocation } from "@/lib/location-storage";

interface LocationState extends StoredLocation {
  setLocation: (location: StoredLocation) => void;
}

/**
 * Client-only reactive mirror of the resolved location, so the topbar
 * country switcher (and anything else) re-renders the moment it changes -
 * localStorage/the backend preference are the persisted source of truth,
 * this is just the in-memory copy components read from. See
 * providers/location-resolver.tsx for how this gets populated.
 */
export const useLocationStore = create<LocationState>((set) => ({
  country: null,
  timezone: "UTC",
  language: "en",

  setLocation: (location) => set(location),
}));
