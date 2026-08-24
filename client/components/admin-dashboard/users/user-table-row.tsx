"use client";

import { useState } from "react";
import { Avatar } from "@/components/common/avatar";
import { StatusBadge } from "@/components/admin-dashboard/widgets/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { adminUsersService } from "@/services/admin-users.service";
import { cn } from "@/lib/utils";
import type { AdminUserSummary } from "@/interfaces/admin-user-api.interface";
import type { DeletionScope } from "@/interfaces/account-deletion.interface";

interface UserTableRowProps {
  user: AdminUserSummary;
  onSuspend: (id: string, reason: string) => Promise<void>;
  onReinstate: (id: string) => Promise<void>;
}

const ROLE_LABELS: Record<string, string> = {
  ROLE_USER: "User",
  ROLE_ORGANIZER: "Organizer",
  ROLE_ADMIN: "Admin",
};

const ROLE_CLASSES: Record<string, string> = {
  ROLE_USER: "bg-ink/5 text-ink-muted",
  ROLE_ORGANIZER: "bg-brand/10 text-brand",
  ROLE_ADMIN: "bg-blue-500/10 text-blue-600",
};

const FORCE_DELETE_CONFIRM_PHRASE = "force delete";

/** Single row in the admin users table - roles render as a badge per role since an account can hold more than one under the dual-role persona model, unlike the old mock data's single role field. */
export function UserTableRow({ user, onSuspend, onReinstate }: UserTableRowProps) {
  const [suspending, setSuspending] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [forceDeleting, setForceDeleting] = useState(false);
  const [forceDeleteScope, setForceDeleteScope] = useState<DeletionScope>("FULL_ACCOUNT");
  const [forceDeleteReason, setForceDeleteReason] = useState("");
  const [forceDeleteConfirmPhrase, setForceDeleteConfirmPhrase] = useState("");
  const [forceDeleteSubmitting, setForceDeleteSubmitting] = useState(false);
  const [forceDeleteError, setForceDeleteError] = useState<string | null>(null);
  const [forceDeleted, setForceDeleted] = useState(false);

  async function handleConfirmSuspend() {
    if (!reason.trim()) {
      setError("A reason is required to suspend");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSuspend(user.id, reason.trim());
      setSuspending(false);
      setReason("");
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't suspend this account." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReinstate() {
    setSubmitting(true);
    setError(null);
    try {
      await onReinstate(user.id);
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't reinstate this account." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmForceDelete() {
    if (!forceDeleteReason.trim()) {
      setForceDeleteError("A reason is required - it's written to the audit log");
      return;
    }
    if (forceDeleteConfirmPhrase.trim().toLowerCase() !== FORCE_DELETE_CONFIRM_PHRASE) {
      setForceDeleteError(`Type "${FORCE_DELETE_CONFIRM_PHRASE}" to confirm`);
      return;
    }
    setForceDeleteSubmitting(true);
    setForceDeleteError(null);
    try {
      await adminUsersService.forceDeleteUser(user.id, forceDeleteScope, forceDeleteReason.trim());
      setForceDeleted(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        // ForceDeleteBlockedException - organizer still has a live/upcoming event
        // with tickets sold. Deliberately not bypassable - see backend comment.
        setForceDeleteError(
          "This organizer still has a live or upcoming event with tickets sold - resolve or complete those first. This can't be bypassed.",
        );
      } else {
        setForceDeleteError("Couldn't force-delete this account.");
      }
    } finally {
      setForceDeleteSubmitting(false);
    }
  }

  const isDualRole = user.roles.includes("ROLE_USER") && user.roles.includes("ROLE_ORGANIZER");
  const isAdmin = user.roles.includes("ROLE_ADMIN");

  return (
    <div className="rounded-xl border border-line bg-background px-4 py-3">
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4">
        <Avatar name={user.fullName || user.email} className="size-9 text-xs" />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{user.fullName || "—"}</p>
          <p className="truncate text-xs text-ink-muted">{user.email}</p>
        </div>

        <div className="hidden gap-1 sm:flex">
          {user.roles.map((role) => (
            <span key={role} className={cn("rounded-lg px-2.5 py-1 text-xs font-semibold", ROLE_CLASSES[role] ?? "bg-ink/5 text-ink-muted")}>
              {ROLE_LABELS[role] ?? role}
            </span>
          ))}
        </div>

        <p className="hidden text-xs text-ink-muted sm:block">{new Date(user.createdAt).toLocaleDateString()}</p>

        <div className="flex items-center gap-2">
          <StatusBadge label={forceDeleted ? "Deleted" : user.enabled ? "Active" : "Suspended"} variant={forceDeleted ? "red" : user.enabled ? "green" : "red"} />
          {!forceDeleted && (
            <>
              {user.enabled ? (
                <Button type="button" size="xs" variant="outline" onClick={() => setSuspending((v) => !v)} disabled={submitting}>
                  Suspend
                </Button>
              ) : (
                <Button type="button" size="xs" variant="outline" onClick={handleReinstate} disabled={submitting}>
                  {submitting ? "…" : "Reinstate"}
                </Button>
              )}
              {!isAdmin && (
                <Button type="button" size="xs" variant="destructive" onClick={() => setForceDeleting((v) => !v)} disabled={forceDeleteSubmitting}>
                  Force delete
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {suspending && (
        <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3 sm:flex-row sm:items-center">
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for suspending this account"
            disabled={submitting}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setSuspending(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={handleConfirmSuspend} disabled={submitting}>
              {submitting ? "Suspending…" : "Confirm suspend"}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

      {forceDeleting && !forceDeleted && (
        <div className="mt-3 flex flex-col gap-2 border-t border-destructive/30 pt-3">
          <p className="text-xs text-ink-muted">
            Bypasses pending bookings, cancellations, payouts, and the grace period entirely. It will NOT bypass a
            live/upcoming event with tickets sold - that must be resolved separately first.
          </p>

          {isDualRole && (
            <div className="flex gap-2">
              {(["CUSTOMER", "ORGANIZER", "FULL_ACCOUNT"] as DeletionScope[]).map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setForceDeleteScope(scope)}
                  disabled={forceDeleteSubmitting}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition",
                    forceDeleteScope === scope ? "border-destructive bg-destructive text-white" : "border-line bg-background text-ink hover:border-destructive",
                  )}
                >
                  {scope === "CUSTOMER" ? "Customer profile" : scope === "ORGANIZER" ? "Organizer profile" : "Full account"}
                </button>
              ))}
            </div>
          )}

          <Input
            value={forceDeleteReason}
            onChange={(e) => setForceDeleteReason(e.target.value)}
            placeholder="Reason (written to the audit log)"
            disabled={forceDeleteSubmitting}
          />
          <Input
            value={forceDeleteConfirmPhrase}
            onChange={(e) => setForceDeleteConfirmPhrase(e.target.value)}
            placeholder={`Type "${FORCE_DELETE_CONFIRM_PHRASE}" to confirm`}
            disabled={forceDeleteSubmitting}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setForceDeleting(false)} disabled={forceDeleteSubmitting}>
              Cancel
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={handleConfirmForceDelete} disabled={forceDeleteSubmitting}>
              {forceDeleteSubmitting ? "Deleting…" : "Force delete"}
            </Button>
          </div>

          {forceDeleteError && <p className="text-xs text-destructive">{forceDeleteError}</p>}
        </div>
      )}
    </div>
  );
}
