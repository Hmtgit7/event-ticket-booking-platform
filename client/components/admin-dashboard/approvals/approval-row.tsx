"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PayoutStatusBadge } from "@/components/dashboard/payouts/payout-status-badge";
import { ApiError } from "@/lib/api-client";

interface ApprovalRowProps {
  id: string;
  title: string;
  subtitle: string;
  amountLabel: string;
  status: string;
  reviewNote: string | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, note: string) => Promise<void>;
}

/**
 * Shared row shape for both the payout and cancellation review queues - the
 * two are structurally identical (an amount, a status, an approve/reject
 * action pair), only the copy and the service calls differ. Reject requires
 * a note inline rather than a modal, since this is a fast admin workflow -
 * dozens of these might get reviewed in one sitting.
 */
export function ApprovalRow({ id, title, subtitle, amountLabel, status, reviewNote, onApprove, onReject }: ApprovalRowProps) {
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPending = status === "REQUESTED";

  async function handleApprove() {
    setSubmitting(true);
    setError(null);
    try {
      await onApprove(id);
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't approve this request." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReject() {
    if (!note.trim()) {
      setError("A reason is required to reject");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onReject(id, note.trim());
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't reject this request." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-line p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{title}</p>
          <p className="text-xs text-ink-muted">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-semibold text-ink">{amountLabel}</p>
          <PayoutStatusBadge status={status} />
        </div>
      </div>

      {reviewNote && !isPending && <p className="mt-2 text-xs text-destructive">{reviewNote}</p>}

      {isPending && (
        <div className="mt-3">
          {rejecting ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reason for rejecting"
                disabled={submitting}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setRejecting(false)} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={handleReject} disabled={submitting}>
                  {submitting ? "Rejecting…" : "Confirm reject"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={handleApprove} disabled={submitting}>
                {submitting ? "Approving…" : "Approve"}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setRejecting(true)} disabled={submitting}>
                Reject
              </Button>
            </div>
          )}
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}
