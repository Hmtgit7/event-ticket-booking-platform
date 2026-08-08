"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PersonaTransitionOverlay } from "@/components/ui/persona-transition-overlay";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.service";
import { personaBroadcast } from "@/lib/persona";
import { usePersona } from "@/hooks/use-persona";

/**
 * Lives inside the Organizer dashboard shell. When "Book now" is clicked
 * on the public site, BookNowAction sends the account here first
 * (?switchTo=user&next=<event path>) instead of opening a dialog on the
 * public page - the confirm happens in the organizer's own context, and
 * only after confirming do they land on the event. Cancelling just clears
 * the query params and leaves them on their dashboard, nothing navigates.
 *
 * Two accounts land here, and they need different handling:
 *  - Dual-role, currently in Organizer persona: just needs a persona
 *    switch (updatePersona) - the Customer role already exists.
 *  - Organizer-only, no Customer role yet: needs that role provisioned
 *    first (becomeCustomer), which is heavier than a plain persona flip -
 *    hence the copy difference and the blocking overlay while it runs.
 */
function PersonaSwitchGateInner() {
  const router = useRouter();
  const pathname = usePathname() ?? "/dashboard";
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const setActivePersona = useAuthStore((state) => state.setActivePersona);
  const { isOrganizerOnly } = usePersona();
  const [open, setOpen] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const switchTo = searchParams?.get("switchTo") ?? null;
    const next = searchParams?.get("next") ?? null;
    const isSafeInternalPath = !!next && next.startsWith("/") && !next.startsWith("//");

    if (switchTo === "user" && isSafeInternalPath) {
      setNextPath(next); // eslint-disable-line react-hooks/set-state-in-effect
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  async function handleConfirm() {
    if (!nextPath) return;
    setOpen(false);
    setSwitching(true);
    try {
      if (isOrganizerOnly) {
        // No Customer role yet - provision it, then land already-active as "user".
        const auth = await authService.becomeCustomer();
        setSession(auth);
        personaBroadcast.announce("user");
      } else {
        // Dual-role already - just flip which persona is active.
        await authService.updatePersona("user");
        setActivePersona("user");
        personaBroadcast.announce("user");
      }
      router.push(nextPath);
    } catch {
      setSwitching(false);
    }
  }

  function handleCancel() {
    setOpen(false);
    router.replace(pathname);
  }

  return (
    <>
      <ConfirmDialog
        open={open}
        title={isOrganizerOnly ? "Set up your Customer account?" : "Switch to Customer view?"}
        description={
          isOrganizerOnly
            ? "You're signed in as an organizer only. Booking a ticket needs a Customer account too - we'll set one up alongside your Organizer account, then take you straight to checkout."
            : "You're signed in as an organizer. Booking this ticket takes you to your Customer dashboard. You can switch back to Organizer anytime from the topbar."
        }
        confirmLabel={isOrganizerOnly ? "Set up & continue" : "Sure, switch & continue"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <PersonaTransitionOverlay
        open={switching}
        message={isOrganizerOnly ? "Setting up your Customer account\u2026" : "Switching to Customer\u2026"}
      />
    </>
  );
}

export function PersonaSwitchGate() {
  return (
    <Suspense fallback={null}>
      <PersonaSwitchGateInner />
    </Suspense>
  );
}
