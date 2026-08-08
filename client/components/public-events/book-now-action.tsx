"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { usePersona } from "@/hooks/use-persona";

interface BookNowActionProps {
  /** Where a customer should ultimately land, e.g. `/user/dashboard/explore/${slug}`. */
  eventPath: string;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * "Book now" / "Get ticket" action used on the public site.
 *  - Signed out                        -> login, redirect param set to this event
 *  - Signed in, user-only              -> straight to the event, no ambiguity to resolve
 *  - Signed in, dual-role, already in  -> straight to the event too - they're already
 *    Customer persona                     acting as a customer, nothing to confirm
 *  - Signed in, dual-role, in Organizer -> routed through the Organizer dashboard first
 *    persona (or never chosen one yet)     (?switchTo=user&next=<eventPath>); PersonaSwitchGate
 *                                           opens the confirm dialog there, not on this page
 *  - Signed in, organizer-only          -> same ?switchTo=user&next=<eventPath> route as
 *    (no Customer role at all)             above. PersonaSwitchGate detects there's no
 *                                           Customer role yet and provisions one (becomeCustomer)
 *                                           instead of just flipping personas. Without this
 *                                           branch these accounts would fall through to the
 *                                           plain `eventPath` below and hit checkout without
 *                                           ever holding ROLE_USER.
 *
 * activePersona is server-truth (see auth-service's User.activePersona), synced into
 * the auth store on login/hydrate/switch and kept live across tabs by PersonaSync - so
 * this never shows a stale confirm-or-not decision.
 */
export function BookNowAction({ eventPath, className, disabled, children }: BookNowActionProps) {
  const isSignedIn = useAuthStore((state) => state.user !== null);
  const { isDualRole, activePersona, isOrganizerOnly } = usePersona();
  const needsSwitchConfirm = (isDualRole && activePersona !== "user") || isOrganizerOnly;

  const href = !isSignedIn
    ? `/auth/login?redirect=${encodeURIComponent(eventPath)}`
    : needsSwitchConfirm
      ? `/dashboard?switchTo=user&next=${encodeURIComponent(eventPath)}`
      : eventPath;

  return (
    <Link href={href} aria-disabled={disabled} className={className}>
      {children}
    </Link>
  );
}
