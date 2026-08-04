"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { SupportTicketRow } from "@/components/admin-dashboard/support/support-ticket-row";
import { ADMIN_SUPPORT } from "@/constants/admin-dashboard-data";
import { cn } from "@/lib/utils";

type StatusFilter  = "All" | "Open" | "In Progress" | "Resolved";
type PriorityFilter = "All" | "High" | "Medium" | "Low";

/** Admin support tickets page — filterable by status and priority. */
export function AdminSupportContainer() {
  const [query,          setQuery]          = useState("");
  const [statusFilter,   setStatusFilter]   = useState<StatusFilter>("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");

  const visible = ADMIN_SUPPORT.filter((t) => {
    const q = query.trim().toLowerCase();
    if (q && !`${t.user} ${t.subject} ${t.id}`.toLowerCase().includes(q)) return false;
    if (statusFilter   !== "All" && t.status   !== statusFilter)   return false;
    if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
    return true;
  });

  const openCount = ADMIN_SUPPORT.filter((t) => t.status === "Open").length;
  const highCount = ADMIN_SUPPORT.filter((t) => t.priority === "High").length;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Summary ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total tickets",       value: String(ADMIN_SUPPORT.length) },
          { label: "Open",                value: String(openCount) },
          { label: "High priority",       value: String(highCount) },
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
            {(["All", "Open", "In Progress", "Resolved"] as StatusFilter[]).map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)}
                className={cn("rounded-full border px-3 py-1 text-xs font-semibold transition",
                  statusFilter === s ? "border-brand bg-brand text-brand-foreground" : "border-line bg-background text-ink hover:border-brand"
                )}>
                {s}
              </button>
            ))}
            {(["All", "High", "Medium", "Low"] as PriorityFilter[]).map((p) => (
              <button key={p} type="button" onClick={() => setPriorityFilter(p)}
                className={cn("rounded-full border px-3 py-1 text-xs font-semibold transition",
                  priorityFilter === p ? "border-ink bg-ink text-background" : "border-line bg-background text-ink hover:border-ink"
                )}>
                {p === "All" ? "Any priority" : p}
              </button>
            ))}
          </div>
        </div>
        <label className="relative mt-4 block max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by user, subject, ID…"
            className="h-10 w-full rounded-xl border border-line bg-background pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-brand"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        {visible.length === 0
          ? <p className="rounded-2xl border border-line bg-surface py-12 text-center text-sm text-ink-muted">No tickets match your filters.</p>
          : visible.map((t) => <SupportTicketRow key={t.id} ticket={t} />)
        }
      </div>
    </div>
  );
}
