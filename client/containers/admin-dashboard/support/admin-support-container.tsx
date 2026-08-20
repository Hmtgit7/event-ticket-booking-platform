"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { SupportTicketRow } from "@/components/admin-dashboard/support/support-ticket-row";
import { EmptyState } from "@/components/common/empty-state";
import { NoResultsIllustration } from "@/icons/empty-state-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { adminSupportTicketService } from "@/services/admin-support.service";
import { cn } from "@/lib/utils";
import type {
  SupportTicketPriority,
  SupportTicketResponse,
  SupportTicketStatus,
} from "@/interfaces/admin-support-api.interface";

type StatusFilter = "All" | SupportTicketStatus;
type PriorityFilter = "All" | SupportTicketPriority;

/**
 * Admin support tickets page. Status is filtered server-side (the backend's
 * ?status= param), since it maps directly onto SupportTicketStatus. Priority
 * and search stay client-side over the current page - the backend doesn't
 * expose those as query params, and this is a small-volume queue.
 */
export function AdminSupportContainer() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [tickets, setTickets] = useState<SupportTicketResponse[] | null>(null);

  useEffect(() => {
    setTickets(null);
    adminSupportTicketService.getAllTickets(statusFilter).then((res) => setTickets(res.items));
  }, [statusFilter]);

  async function handleUpdate(
    id: string,
    payload: { status?: SupportTicketStatus; priority?: SupportTicketPriority; resolutionNote?: string },
  ) {
    const updated = await adminSupportTicketService.updateTicket(id, payload);
    setTickets((prev) => (prev ?? []).map((t) => (t.id === id ? updated : t)));
  }

  const visible = (tickets ?? []).filter((t) => {
    const q = query.trim().toLowerCase();
    if (q && !`${t.subject} ${t.id}`.toLowerCase().includes(q)) return false;
    if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
    return true;
  });

  const openCount = (tickets ?? []).filter((t) => t.status === "OPEN").length;
  const highCount = (tickets ?? []).filter((t) => t.priority === "HIGH").length;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Summary ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total tickets", value: String((tickets ?? []).length) },
          { label: "Open", value: String(openCount) },
          { label: "High priority", value: String(highCount) },
        ].map(({ label, value }) => (
          <article key={label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="mt-2 text-3xl font-black text-ink">{value}</p>
          </article>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AdminSectionTitle eyebrow="Help Desk" title="Support Tickets" />
          <div className="flex flex-wrap gap-2">
            {(["All", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold capitalize transition",
                  statusFilter === s ? "border-brand bg-brand text-brand-foreground" : "border-line bg-background text-ink hover:border-brand",
                )}
              >
                {s === "All" ? "All" : s.replace("_", " ").toLowerCase()}
              </button>
            ))}
            {(["All", "HIGH", "MEDIUM", "LOW"] as PriorityFilter[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold capitalize transition",
                  priorityFilter === p ? "border-brand bg-brand text-brand-foreground" : "border-line bg-background text-ink hover:border-brand",
                )}
              >
                {p === "All" ? "Any priority" : p.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        <label className="relative mt-4 block max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by subject, ID…"
            className="h-10 w-full rounded-xl border border-line bg-background pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-brand"
          />
        </label>
      </div>

      {tickets === null ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.length === 0 ? (
            <EmptyState
              icon={<NoResultsIllustration className="size-24" />}
              title="No tickets match your filters"
              description="Try a different search term or filter combination."
            />
          ) : (
            visible.map((t) => <SupportTicketRow key={t.id} ticket={t} onUpdate={handleUpdate} />)
          )}
        </div>
      )}
    </div>
  );
}
