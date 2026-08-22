"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/modules/auth/hooks/use-current-user";
import { AccountDeletionModal } from "@/components/auth/account-deletion-modal";
import { Role } from "@/enums/role.enum";
import type { DeletionScope } from "@/interfaces/account-deletion.interface";

interface DangerZoneCardProps {
  /** Which dashboard this card lives in - decides whether a dual-role account gets a scoped "delete X profile" option, or the full "delete account" flow for a single-role account. */
  persona: "user" | "organizer";
}

const PERSONA_ROLE: Record<"user" | "organizer", Role> = {
  user: Role.User,
  organizer: Role.Organizer,
};
const OTHER_ROLE: Record<"user" | "organizer", Role> = {
  user: Role.Organizer,
  organizer: Role.User,
};
const SCOPE: Record<"user" | "organizer", DeletionScope> = {
  user: "CUSTOMER",
  organizer: "ORGANIZER",
};
const PERSONA_LABEL: Record<"user" | "organizer", string> = {
  user: "customer",
  organizer: "organizer",
};

/**
 * Self-contained danger-zone section - drop into any settings/profile page.
 * The "if dual-role, offer a scoped profile deletion; otherwise just offer
 * full account deletion" rule lives here so both dashboards get it for free
 * without duplicating the logic.
 */
export function DangerZoneCard({ persona }: DangerZoneCardProps) {
  const { data: user, isLoading } = useCurrentUser();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading || !user) {
    return null;
  }

  // Already mid-deletion for this exact scope (or the whole account) - the
  // pending-deletion banner already covers this, no need to also show the button.
  if (user.deletionStatus === "PENDING_DELETION") {
    return null;
  }

  const isDualRole = user.roles.includes(PERSONA_ROLE[persona]) && user.roles.includes(OTHER_ROLE[persona]);
  const scope: DeletionScope = isDualRole ? SCOPE[persona] : "FULL_ACCOUNT";
  const label = isDualRole ? `Delete ${PERSONA_LABEL[persona]} profile` : "Delete account";
  const description = isDualRole
    ? `This removes your ${PERSONA_LABEL[persona]} access only - your other role keeps working normally.`
    : "This permanently deletes your account and everything tied to it. This can't be undone once the grace period ends.";

  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
        <h2 className="text-base font-semibold text-ink">Danger zone</h2>
      </div>
      <p className="mt-1 text-sm text-ink-muted">{description}</p>

      <Button type="button" variant="destructive" className="mt-4" onClick={() => setModalOpen(true)}>
        {label}
      </Button>

      <AccountDeletionModal open={modalOpen} onClose={() => setModalOpen(false)} scope={scope} title={label} />
    </div>
  );
}
