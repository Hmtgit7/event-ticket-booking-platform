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
export function usePersona(): { isDualRole: boolean; activePersona: Persona | null } {
  const user = useAuthStore((state) => state.user);
  const isDualRole = !!user && user.roles.includes(Role.Organizer) && user.roles.includes(Role.User);
  return {
    isDualRole,
    activePersona: isDualRole ? (user?.activePersona ?? null) : null,
  };
}
