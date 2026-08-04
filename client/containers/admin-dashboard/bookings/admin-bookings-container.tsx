"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { BookingTableRow } from "@/components/admin-dashboard/bookings/booking-table-row";
import { ADMIN_BOOKINGS } from "@/constants/admin-dashboard-data";
import { cn } from "@/lib/utils";

type StatusFilter = "All" | "Confirmed" | "Pending" | "Refunded" | "Cancelled";

/** Admin bookings monitor — filterable list of all platform bookings. */
export function AdminBookingsContainer() {
  const [query,        setQuery]        = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const visible = ADMIN_BOOKINGS.filter((b) => {
    const q = query.trim().toLowerCase();
    if (q && !`${b.user} ${b.event} ${b.id}`.toLowerCase().includes(q)) return false;
    if (statusFilter !== "All" && b.status !== statusFilter) return false;
    return true;
  });

  const totalRevenue = ADMIN_BOOKINGS
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + parseInt(b.amount.replace(/\D/g, "") || "0", 10), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Summary cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total bookings",     value: String(ADMIN_BOOKINGS.length) },
          { label: "Confirmed",          value: String(ADMIN_BOOKINGS.filter((b) => b.status === "Confirmed").length) },
          { label: "Revenue (confirmed)",value: `$${totalRevenue.toLocaleString()}` },
        ].map(({ label, value }) => (
          <article key={label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="mt-2 text-3xl font-black text-ink">{value}</p>
          </article>
        ))}
      </div>

      {/* ── Header + filters ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AdminSectionTitle eyebrow="Monitor" title="All Bookings" />
          <div className="flex flex-wrap gap-2">
            {(["All", "Confirmed", "Pending", "Refunded", "Cancelled"] as StatusFilter[]).map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)}
                className={cn("rounded-full border px-3 py-1 text-xs font-semibold transition",
                  statusFilter === s ? "border-brand bg-brand text-brand-foreground" : "border-line bg-background text-ink hover:border-brand"
                )}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <label className="relative mt-4 block max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by user, event, booking ID…"
            className="h-10 w-full rounded-xl border border-line bg-background pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-brand"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        {visible.length === 0
          ? <p className="rounded-2xl border border-line bg-surface py-12 text-center text-sm text-ink-muted">No bookings match your filters.</p>
          : visible.map((b) => <BookingTableRow key={b.id} booking={b} />)
        }
      </div>
    </div>
  );
}
