"use client";

import { useCurrentUser } from "@/modules/auth/hooks/use-current-user";
import { useCancelAccountDeletion } from "@/modules/auth/hooks/use-cancel-account-deletion";

/**
 * App-wide banner shown on every dashboard page (see DashboardTopbar) while
 * an account/profile deletion is in its grace period. Reuses GET /auth/me
 * (already fetched everywhere via useCurrentUser) rather than a separate
 * status endpoint - one less request, and it stays in sync with whatever
 * else on the page is already refetching that query.
 */
export function PendingDeletionBanner() {
  const { data: user } = useCurrentUser();
  const cancelDeletion = useCancelAccountDeletion();

  if (!user || user.deletionStatus !== "PENDING_DELETION") {
    return null;
  }

  const scheduledFor = user.deletionScheduledFor
    ? new Date(user.deletionScheduledFor).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const scopeLabel =
    user.deletionScope === "CUSTOMER"
      ? "customer profile"
      : user.deletionScope === "ORGANIZER"
        ? "organizer profile"
        : "account";

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-3 text-sm">
      <p className="font-medium text-destructive">
        Your {scopeLabel} is scheduled for deletion{scheduledFor ? ` on ${scheduledFor}` : ""}.
      </p>
      <button
        type="button"
        disabled={cancelDeletion.isPending}
        onClick={() => cancelDeletion.submit()}
        className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cancelDeletion.isPending ? "Cancelling…" : "Cancel deletion"}
      </button>
    </div>
  );
}
