"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.service";
import { personaBroadcast, type Persona } from "@/lib/persona";
import { usePersona } from "@/hooks/use-persona";

const PERSONA_HOME: Record<Persona, string> = {
  organizer: "/dashboard",
  user: "/user/dashboard",
};

/**
 * Hard persona enforcement for dual-role accounts, across every open tab
 * AND every future login/device - the persisted value lives on the account
 * itself (auth-service's User.activePersona), not in this browser.
 *
 *  1. Mounting this shell IS the deliberate signal that this persona is now
 *     active - persists it to the server, then announces it to every open
 *     tab via BroadcastChannel for an instant update (no need for those tabs
 *     to wait on their own network round trip).
 *  2. If a DIFFERENT tab announces the other persona, this tab force-
 *     navigates to match - the same account never shows two different
 *     dashboards open at once.
 *
 * No-op for single-role accounts - there's no "other" shell to conflict with.
 */
export function PersonaSync({ persona }: { persona: Persona }) {
  const router = useRouter();
  const { isDualRole, activePersona } = usePersona();
  const setActivePersona = useAuthStore((state) => state.setActivePersona);

  useEffect(() => {
    if (!isDualRole) return;

    if (activePersona !== persona) {
      authService
        .updatePersona(persona)
        .then(() => {
          setActivePersona(persona);
          personaBroadcast.announce(persona);
        })
        .catch(() => {
          // Non-critical - worst case this tab just doesn't get credit as
          // "last active persona" for the next login. Nothing to recover from here.
        });
    }

    return personaBroadcast.subscribe((incoming) => {
      if (incoming !== persona) {
        router.replace(PERSONA_HOME[incoming]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDualRole, persona]);

  return null;
}
