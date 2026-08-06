"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { personaStorage } from "@/lib/persona";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Role } from "@/enums/role.enum";

/**
 * Lets a dual-role account (organizer + customer on the same login)
 * deliberately switch between the Organizer dashboard and the Customer
 * dashboard, with a confirmation step - replaces the old implicit
 * behavior where clicking "Book now" silently dropped an organizer into
 * a different shell with no explanation.
 *
 * Renders nothing for accounts that only hold one of the two roles -
 * the vast majority of users never see this at all.
 */
export function PersonaSwitchButton() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const user = useAuthStore((state) => state.user);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isDualRole = !!user && user.roles.includes(Role.Organizer) && user.roles.includes(Role.User);
  if (!isDualRole) return null;

  const inOrganizerView = pathname.startsWith("/dashboard");
  const targetPersona = inOrganizerView ? "user" : "organizer";
  const targetPath = inOrganizerView ? "/user/dashboard" : "/dashboard";
  const label = inOrganizerView ? "Switch to Customer view" : "Switch to Organizer view";

  function handleConfirm() {
    personaStorage.set(targetPersona);
    setConfirmOpen(false);
    router.push(targetPath);
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
        confirmLabel="Sure, switch"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
