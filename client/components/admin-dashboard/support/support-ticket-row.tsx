"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/admin-dashboard/widgets/status-badge";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import type {
  SupportTicketPriority,
  SupportTicketResponse,
  SupportTicketStatus,
} from "@/interfaces/admin-support-api.interface";

interface SupportTicketRowProps {
  ticket: SupportTicketResponse;
  onUpdate: (
    id: string,
    payload: { status?: SupportTicketStatus; priority?: SupportTicketPriority; resolutionNote?: string },
  ) => Promise<void>;
}

const statusVariant: Record<SupportTicketStatus, "red" | "yellow" | "green" | "muted"> = {
  OPEN:        "red",
  IN_PROGRESS: "yellow",
  RESOLVED:    "green",
  CLOSED:      "muted",
};

const priorityVariant: Record<SupportTicketPriority, "red" | "yellow" | "muted"> = {
  HIGH:   "red",
  MEDIUM: "yellow",
  LOW:    "muted",
};

const categoryLabels: Record<string, string> = {
  REFUND:      "Refund",
  TECHNICAL:   "Technical",
  EVENT_ISSUE: "Event issue",
  PAYMENT:     "Payment",
  OTHER:       "Other",
};

const selectClasses =
  "h-9 rounded-lg border border-line bg-background px-2 text-xs text-ink outline-none transition focus:border-brand";

/**
 * Single row in the admin support ticket list. Expands into a combined
 * editor (status + priority + resolution note in one PATCH) rather than
 * separate approve/reject actions - matches how the backend models an
 * admin working a ticket as one action, not a review pipeline.
 */
export function SupportTicketRow({ ticket, onUpdate }: SupportTicketRowProps) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<SupportTicketStatus>(ticket.status);
  const [priority, setPriority] = useState<SupportTicketPriority>(ticket.priority);
  const [resolutionNote, setResolutionNote] = useState(ticket.resolutionNote ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSubmitting(true);
    setError(null);
    try {
      await onUpdate(ticket.id, { status, priority, resolutionNote: resolutionNote.trim() });
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't update this ticket." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-line bg-background px-4 py-3">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 sm:grid-cols-[auto_1fr_auto_auto_auto]">
        <p className="hidden text-xs font-mono text-ink-muted sm:block">{ticket.id.slice(0, 8)}…</p>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{ticket.subject}</p>
          <p className="mt-0.5 truncate text-xs text-ink-muted">
            {categoryLabels[ticket.category] ?? ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}
          </p>
        </div>

        <StatusBadge label={ticket.priority} variant={priorityVariant[ticket.priority]} />
        <StatusBadge label={ticket.status.replace("_", " ")} variant={statusVariant[ticket.status]} />

        <Button type="button" size="xs" variant="outline" onClick={() => setEditing((v) => !v)}>
          {editing ? "Close" : "Manage"}
        </Button>
      </div>

      {editing && (
        <div className="mt-3 flex flex-col gap-3 border-t border-line pt-3">
          <p className="text-xs text-ink-muted">{ticket.description}</p>

          <div className="flex flex-wrap gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as SupportTicketStatus)}
              disabled={submitting}
              className={selectClasses}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as SupportTicketPriority)}
              disabled={submitting}
              className={selectClasses}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <textarea
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder="Resolution note (visible to the submitter)"
            disabled={submitting}
            rows={2}
            className="w-full resize-none rounded-lg border border-line bg-background px-2.5 py-2 text-xs text-ink outline-none transition focus:border-brand"
          />

          <div className="flex items-center gap-2">
            <Button type="button" size="sm" onClick={handleSave} disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </Button>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
