"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { EventTableRow } from "@/components/admin-dashboard/events/event-table-row";
import { ADMIN_EVENTS } from "@/constants/admin-dashboard-data";
import { cn } from "@/lib/utils";

type StatusFilter = "All" | "Live" | "Draft" | "Flagged" | "Ended";

/** Admin events moderation page — filterable event list with status controls. */
export function AdminEventsContainer() {
  const [query,        setQuery]        = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const visible = ADMIN_EVENTS.filter((e) => {
    const q = query.trim().toLowerCase();
    if (q && !`${e.title} ${e.organizer} ${e.category}`.toLowerCase().includes(q)) return false;
    if (statusFilter !== "All" && e.status !== statusFilter) return false;
    return true;
  });

  const counts = {
    All:     ADMIN_EVENTS.length,
    Live:    ADMIN_EVENTS.filter((e) => e.status === "Live").length,
    Draft:   ADMIN_EVENTS.filter((e) => e.status === "Draft").length,
    Flagged: ADMIN_EVENTS.filter((e) => e.status === "Flagged").length,
    Ended:   ADMIN_EVENTS.filter((e) => e.status === "Ended").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AdminSectionTitle eyebrow="Moderation" title="Events" />
          <div className="flex flex-wrap gap-2">
            {(["All", "Live", "Draft", "Flagged", "Ended"] as StatusFilter[]).map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition",
                  statusFilter === s ? "border-brand bg-brand text-brand-foreground" : "border-line bg-background text-ink hover:border-brand",
                )}>
                {s}
                <span className="ml-1 opacity-60">({counts[s]})</span>
              </button>
            ))}
          </div>
        </div>

        <label className="relative mt-4 block max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, organizer, category…"
            className="h-10 w-full rounded-xl border border-line bg-background pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-brand"
          />
        </label>
      </div>

      {/* ── Column labels ── */}
      <div className="hidden grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 text-xs font-semibold uppercase tracking-wider text-ink-muted sm:grid">
        <span>Event</span><span>Date</span><span>Tickets sold</span><span>Revenue</span><span>Status</span>
      </div>

      <div className="flex flex-col gap-2">
        {visible.length === 0
          ? <p className="rounded-2xl border border-line bg-surface py-12 text-center text-sm text-ink-muted">No events match your filters.</p>
          : visible.map((event) => <EventTableRow key={event.id} event={event} />)
        }
      </div>
    </div>
  );
}
