"use client";

import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/enums/role.enum";
import type { Persona } from "@/lib/persona";

/**
 * Reactive read of an account's dual-role status and current persona.
 * Both come straight from useAuthStore's user object, which is sourced from
 * the server (auth-service's User.activePersona) on login/hydrate/switch -
 * so this is already live-synced with the server truth, no extra
 * subscription needed for same-tab reactivity.
 */
export function usePersona(): {
  isDualRole: boolean;
  activePersona: Persona | null;
  /** Signed in, holds ROLE_USER, does not hold ROLE_ORGANIZER. Drives the "want to publish events?" sidebar CTA. */
  isUserOnly: boolean;
  /** Signed in, holds ROLE_ORGANIZER, does not hold ROLE_USER. Drives the booking gate's "set up customer account" step. */
  isOrganizerOnly: boolean;
} {
  const user = useAuthStore((state) => state.user);
  const hasOrganizer = !!user && user.roles.includes(Role.Organizer);
  const hasUser = !!user && user.roles.includes(Role.User);
  const isDualRole = hasOrganizer && hasUser;
  return {
    isDualRole,
    activePersona: isDualRole ? (user?.activePersona ?? null) : null,
    isUserOnly: !!user && hasUser && !hasOrganizer,
    isOrganizerOnly: !!user && hasOrganizer && !hasUser,
  };
}
