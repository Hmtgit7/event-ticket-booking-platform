"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { EventTableRow } from "@/components/admin-dashboard/events/event-table-row";
import { EmptyState } from "@/components/common/empty-state";
import { NoResultsIllustration } from "@/icons/empty-state-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { adminEventsService } from "@/services/admin-events.service";
import { cn } from "@/lib/utils";
import type { AdminEventStatus, AdminEventSummary } from "@/interfaces/admin-event-api.interface";

type StatusFilter = "All" | AdminEventStatus;

const FILTERS: StatusFilter[] = ["All", "PUBLISHED", "DRAFT", "FLAGGED", "REMOVED", "CANCELLED", "COMPLETED"];
const FILTER_LABEL: Record<StatusFilter, string> = {
  All: "All", PUBLISHED: "Live", DRAFT: "Draft", FLAGGED: "Flagged",
  REMOVED: "Removed", CANCELLED: "Cancelled", COMPLETED: "Ended",
};

/** Admin events moderation page - status filter drives the server-side query (not client-side filtering) since /admin/events already supports a status param. Search is client-side over the current page only, same tradeoff as before. */
export function AdminEventsContainer() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AdminSectionTitle eyebrow="Moderation" title="Events" />
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition",
                  statusFilter === s ? "border-brand bg-brand text-brand-foreground" : "border-line bg-background text-ink hover:border-brand",
                )}>
                {FILTER_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        <label className="relative mt-4 block max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, category, city…"
            className="h-10 w-full rounded-xl border border-line bg-background pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-brand"
          />
        </label>
      </div>

      <AdminEventsList key={statusFilter} statusFilter={statusFilter} query={query} />
    </div>
  );
}

function AdminEventsList({ statusFilter, query }: { statusFilter: StatusFilter; query: string }) {
  const [events, setEvents] = useState<AdminEventSummary[] | null>(null);

  useEffect(() => {
    adminEventsService.listEvents(statusFilter === "All" ? null : statusFilter).then((res) => setEvents(res.items));
  }, [statusFilter]);

  function updateEvent(id: string, patch: Partial<AdminEventSummary>) {
    setEvents((prev) => (prev ?? []).map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  async function handleFlag(id: string, reason: string) {
    const result = await adminEventsService.flagEvent(id, reason);
    updateEvent(id, { status: result.status, moderationReason: result.moderationReason });
  }

  async function handleUnflag(id: string) {
    const result = await adminEventsService.unflagEvent(id);
    updateEvent(id, { status: result.status, moderationReason: result.moderationReason });
  }

  async function handleRemove(id: string, reason: string) {
    const result = await adminEventsService.removeEvent(id, reason);
    updateEvent(id, { status: result.status, moderationReason: result.moderationReason });
  }

  async function handleRestore(id: string) {
    const result = await adminEventsService.restoreEvent(id);
    updateEvent(id, { status: result.status, moderationReason: result.moderationReason });
  }

  const visible = (events ?? []).filter((e) => {
    const q = query.trim().toLowerCase();
    if (q && !`${e.title} ${e.category} ${e.city}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <>
      {/* ── Column labels ── */}
      <div className="hidden grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 text-xs font-semibold uppercase tracking-wider text-ink-muted sm:grid">
        <span>Event</span><span>Date</span><span>Tickets sold</span><span>From price</span><span>Status</span>
      </div>

      {events === null ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState icon={<NoResultsIllustration className="size-24" />} title="No events match your filters" description="Try a different search term or status filter." />
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((event) => (
            <EventTableRow
              key={event.id}
              event={event}
              onFlag={handleFlag}
              onUnflag={handleUnflag}
              onRemove={handleRemove}
              onRestore={handleRestore}
            />
          ))}
        </div>
      )}
    </>
  );
}
