"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.service";
import { personaBroadcast } from "@/lib/persona";
import { usePersona } from "@/hooks/use-persona";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

interface PersonaSwitchButtonProps {
  collapsed?: boolean;
}

/**
 * Lets a dual-role account deliberately switch between the Organizer
 * dashboard and the Customer dashboard, with a confirmation step. Lives in
 * the sidebar, just below the logo, in both dashboard shells. Renders
 * nothing for single-role accounts - the vast majority of users never see
 * this at all.
 */
export function PersonaSwitchButton({ collapsed }: PersonaSwitchButtonProps) {
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
        title={label}
        aria-label={label}
        className={cn(
          "flex w-full items-center justify-center gap-2.5 rounded-xl border border-sidebar-foreground/10 bg-sidebar-accent/60 px-3 py-2.5 text-xs font-semibold text-sidebar-foreground transition-colors hover:border-brand hover:text-brand",
          collapsed && "px-0",
        )}
      >
        <ArrowLeftRight className="size-[15px] shrink-0" />
        <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
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
