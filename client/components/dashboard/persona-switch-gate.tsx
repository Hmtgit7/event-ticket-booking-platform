"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.service";
import { personaBroadcast } from "@/lib/persona";

/**
 * Lives inside the Organizer dashboard shell. When "Book now" is clicked
 * on the public site by a dual-role account currently in Organizer
 * persona, BookNowAction sends them here first (?switchTo=user&next=<event
 * path>) instead of opening a dialog on the public page - the confirm
 * happens in the organizer's own context, and only after confirming (and
 * persisting the switch server-side) do they land on the event.
 * Cancelling just clears the query params and leaves them on their
 * dashboard, nothing navigates.
 */
function PersonaSwitchGateInner() {
  const router = useRouter();
  const pathname = usePathname() ?? "/dashboard";
  const searchParams = useSearchParams();
  const setActivePersona = useAuthStore((state) => state.setActivePersona);
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
    setSwitching(true);
    try {
      await authService.updatePersona("user");
      setActivePersona("user");
      personaBroadcast.announce("user");
      setOpen(false);
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
    <ConfirmDialog
      open={open}
      title="Switch to Customer view?"
      description="You're signed in as an organizer. Booking this ticket takes you to your Customer dashboard. You can switch back to Organizer anytime from the topbar."
      confirmLabel={switching ? "Switching\u2026" : "Sure, switch & continue"}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}

export function PersonaSwitchGate() {
  return (
    <Suspense fallback={null}>
      <PersonaSwitchGateInner />
    </Suspense>
  );
}
