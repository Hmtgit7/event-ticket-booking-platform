"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/admin-dashboard/widgets/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import type { AdminEventStatus, AdminEventSummary } from "@/interfaces/admin-event-api.interface";

interface EventTableRowProps {
  event: AdminEventSummary;
  onFlag: (id: string, reason: string) => Promise<void>;
  onUnflag: (id: string) => Promise<void>;
  onRemove: (id: string, reason: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
}

const STATUS_LABEL: Record<AdminEventStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Live",
  CANCELLED: "Cancelled",
  COMPLETED: "Ended",
  FLAGGED: "Flagged",
  REMOVED: "Removed",
};

const STATUS_VARIANT: Record<AdminEventStatus, "green" | "muted" | "red" | "blue" | "yellow"> = {
  DRAFT: "muted",
  PUBLISHED: "green",
  CANCELLED: "blue",
  COMPLETED: "blue",
  FLAGGED: "yellow",
  REMOVED: "red",
};

type PendingAction = "flag" | "remove" | null;

/** Single row in the admin events table - moderation actions gated by current status (only PUBLISHED can be flagged, only FLAGGED can be unflagged, etc.), mirroring the guards already enforced server-side in EventService. */
export function EventTableRow({ event, onFlag, onUnflag, onRemove, onRestore }: EventTableRowProps) {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setSubmitting(true);
    setError(null);
    try {
      await action();
      setPendingAction(null);
      setReason("");
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't complete that action." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleConfirm() {
    if (!reason.trim()) {
      setError("A reason is required");
      return;
    }
    if (pendingAction === "flag") run(() => onFlag(event.id, reason.trim()));
    if (pendingAction === "remove") run(() => onRemove(event.id, reason.trim()));
  }

  return (
    <div className="rounded-xl border border-line bg-background px-4 py-3">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 sm:grid-cols-[1fr_auto_auto_auto_auto]">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{event.title}</p>
          <p className="mt-0.5 truncate text-xs text-ink-muted">
            Organizer {event.organizerId.slice(0, 8)}… · {event.category}
          </p>
        </div>

        <p className="hidden text-xs text-ink-muted sm:block">{new Date(event.startAt).toLocaleDateString()}</p>
        <p className="hidden text-xs font-semibold text-ink sm:block">{event.totalSold.toLocaleString()} sold</p>
        <p className="hidden text-xs font-semibold text-positive sm:block">
          {event.fromPrice != null ? `₹${event.fromPrice.toFixed(2)}+` : "—"}
        </p>

        <div className="flex items-center gap-2">
          <StatusBadge label={STATUS_LABEL[event.status]} variant={STATUS_VARIANT[event.status]} />
        </div>
      </div>

      {event.moderationReason && (event.status === "FLAGGED" || event.status === "REMOVED") && (
        <p className="mt-2 text-xs text-destructive">{event.moderationReason}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
        {event.status === "PUBLISHED" && (
          <>
            <Button type="button" size="xs" variant="outline" onClick={() => setPendingAction("flag")} disabled={submitting}>
              Flag
            </Button>
            <Button type="button" size="xs" variant="destructive" onClick={() => setPendingAction("remove")} disabled={submitting}>
              Remove
            </Button>
          </>
        )}
        {event.status === "FLAGGED" && (
          <>
            <Button type="button" size="xs" variant="outline" onClick={() => run(() => onUnflag(event.id))} disabled={submitting}>
              Unflag
            </Button>
            <Button type="button" size="xs" variant="destructive" onClick={() => setPendingAction("remove")} disabled={submitting}>
              Remove
            </Button>
          </>
        )}
        {event.status === "REMOVED" && (
          <Button type="button" size="xs" variant="outline" onClick={() => run(() => onRestore(event.id))} disabled={submitting}>
            Restore
          </Button>
        )}
      </div>

      {pendingAction && (
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={pendingAction === "flag" ? "Reason for flagging" : "Reason for removing"}
            disabled={submitting}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPendingAction(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={handleConfirm} disabled={submitting}>
              {submitting ? "Submitting…" : "Confirm"}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
