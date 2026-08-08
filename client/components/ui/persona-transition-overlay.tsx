"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GrabMyTicketLogoMark } from "@/icons/grabmyticket-logo";

interface PersonaTransitionOverlayProps {
  open: boolean;
  /** e.g. "Setting up your customer account…" / "Switching to Organizer…" */
  message: string;
}

/**
 * Full-page blocking loader shown while an account's role/persona is being
 * changed server-side (switch persona, become-organizer, become-customer).
 * These calls aren't instant - becomeCustomer in particular provisions a
 * customer profile the first time - so a silent disabled button isn't
 * enough feedback. One shared component for every transition in the app
 * keeps the motion consistent and avoids re-solving this per flow.
 *
 * Deliberately NOT dismissible (no backdrop click, no Escape) - the caller
 * owns `open` and clears it only once the transition has actually resolved,
 * success or failure.
 */
export function PersonaTransitionOverlay({ open, message }: PersonaTransitionOverlayProps) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-sm"
    >
      <div className="relative flex size-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
        <GrabMyTicketLogoMark className="relative size-12 animate-pulse rounded-xl" />
      </div>
      <p className="text-sm font-medium text-ink-muted">{message}</p>
    </div>,
    document.body,
  );
}
