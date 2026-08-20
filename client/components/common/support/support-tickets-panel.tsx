"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { supportTicketService } from "@/services/admin-support.service";
import type {
  SupportTicketCategory,
  SupportTicketResponse,
  SupportTicketStatus,
} from "@/interfaces/admin-support-api.interface";

const categoryLabels: Record<SupportTicketCategory, string> = {
  REFUND: "Refund",
  TECHNICAL: "Technical issue",
  EVENT_ISSUE: "Event issue",
  PAYMENT: "Payment issue",
  OTHER: "Other",
};

const statusClasses: Record<SupportTicketStatus, string> = {
  OPEN: "bg-brand/10 text-brand border-brand/30",
  IN_PROGRESS: "bg-yellow-500/10 text-yellow-600 border-yellow-400/30 dark:text-yellow-400",
  RESOLVED: "bg-positive/10 text-positive border-positive/30",
  CLOSED: "bg-ink/10 text-ink-muted border-line",
};

const statusLabels: Record<SupportTicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

/**
 * Shared submitter-side support panel - new-ticket form + "my tickets" list.
 * Persona-agnostic by design: SupportTicketController authorizes both
 * ROLE_USER and ROLE_ORGANIZER identically, and the ticket shape doesn't
 * differ between them, so one component serves both dashboards rather than
 * maintaining two copies.
 */
export function SupportTicketsPanel() {
  const [tickets, setTickets] = useState<SupportTicketResponse[] | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    supportTicketService.getMyTickets().then((res) => setTickets(res.items));
  }, []);

  function handleCreated(ticket: SupportTicketResponse) {
    setTickets((prev) => [ticket, ...(prev ?? [])]);
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">Help</p>
            <h2 className="mt-1 text-xl font-bold text-ink">Support tickets</h2>
          </div>
          <Button type="button" size="sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "New ticket"}
          </Button>
        </div>

        {showForm && <NewTicketForm onCreated={handleCreated} />}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Your tickets</p>
        <div className="mt-4 flex flex-col gap-3">
          {tickets === null ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-ink-muted">You haven&apos;t opened any support tickets yet.</p>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-col gap-2 rounded-xl border border-line bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{ticket.subject}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {categoryLabels[ticket.category]} · {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                  {ticket.resolutionNote && (
                    <p className="mt-1 text-xs text-ink-muted">
                      <span className="font-semibold text-ink">Response:</span> {ticket.resolutionNote}
                    </p>
                  )}
                </div>
                <span className={cn("shrink-0 self-start rounded-lg border px-3 py-1 text-xs font-bold sm:self-center", statusClasses[ticket.status])}>
                  {statusLabels[ticket.status]}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function NewTicketForm({ onCreated }: { onCreated: (ticket: SupportTicketResponse) => void }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SupportTicketCategory>("OTHER");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError("Please fill in both a subject and a description");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const ticket = await supportTicketService.createTicket({
        subject: subject.trim(),
        description: description.trim(),
        category,
      });
      onCreated(ticket);
      setSubject("");
      setDescription("");
      setCategory("OTHER");
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't submit your ticket. Please try again." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
      <Input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        disabled={submitting}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as SupportTicketCategory)}
        disabled={submitting}
        className="h-9 rounded-lg border border-line bg-background px-2.5 text-sm text-ink outline-none transition focus:border-brand"
      >
        {(Object.keys(categoryLabels) as SupportTicketCategory[]).map((c) => (
          <option key={c} value={c}>
            {categoryLabels[c]}
          </option>
        ))}
      </select>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the issue…"
        disabled={submitting}
        rows={3}
        className="w-full resize-none rounded-lg border border-line bg-background px-2.5 py-2 text-sm text-ink outline-none transition focus:border-brand"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" disabled={submitting} className="self-end">
        {submitting ? "Submitting…" : "Submit ticket"}
      </Button>
    </form>
  );
}
