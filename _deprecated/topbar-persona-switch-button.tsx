"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.service";
import { personaBroadcast } from "@/lib/persona";
import { usePersona } from "@/hooks/use-persona";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

/**
 * Lets a dual-role account deliberately switch between the Organizer
 * dashboard and the Customer dashboard, with a confirmation step. Renders
 * nothing for single-role accounts - the vast majority of users never see
 * this at all.
 */
export function PersonaSwitchButton() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { isDualRole } = usePersona();
  const setActivePersona = useAuthStore((state) => state.setActivePersona);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (!isDualRole) return null;

  const inOrganizerView = pathname.startsWith("/dashboard");
  const targetPersona = inOrganizerView ? "user" : "organizer";
  const targetPath = inOrganizerView ? "/user/dashboard" : "/dashboard";
  const label = inOrganizerView ? "Switch to Customer view" : "Switch to Organizer view";

  async function handleConfirm() {
    setSwitching(true);
    try {
      await authService.updatePersona(targetPersona);
      setActivePersona(targetPersona);
      personaBroadcast.announce(targetPersona);
      setConfirmOpen(false);
      router.push(targetPath);
    } catch {
      setSwitching(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand sm:flex"
      >
        <ArrowLeftRight className="size-3.5" />
        {label}
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title={inOrganizerView ? "Switch to Customer view?" : "Switch to Organizer view?"}
        description={
          inOrganizerView
            ? "You'll leave your Organizer dashboard and see GrabMyTicket as a ticket buyer instead. You can switch back anytime."
            : "You'll leave the Customer dashboard and manage your events instead. You can switch back anytime."
        }
        confirmLabel={switching ? "Switching\u2026" : "Sure, switch"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
