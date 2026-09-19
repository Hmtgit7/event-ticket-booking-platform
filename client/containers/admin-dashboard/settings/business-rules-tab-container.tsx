"use client";

import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";

/**
 * Admin Settings — Business Rules tab. Surfaces the commission and
 * cancellation-fee rates that currently live only as hardcoded
 * placeholder values in backend config — nowhere in the app could you
 * previously see or change them. Local/mock for now: editing these
 * fields doesn't persist anywhere yet. Wiring this to a real platform
 * config endpoint (and the eventual per-region rates once GrabMyTicket
 * goes multi-country) is a separate follow-up.
 */
export function BusinessRulesTabContainer() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <AdminSectionTitle eyebrow="Finance" title="Business rules" />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-ink-muted">Platform commission</span>
          <div className="relative mt-1">
            <input
              type="number"
              defaultValue={10}
              min={0}
              max={100}
              step={0.5}
              className="h-10 w-full rounded-xl border border-line bg-background px-3 pr-9 text-sm text-ink outline-none focus:border-brand"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-muted">%</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Cut GrabMyTicket takes from every ticket sale.</p>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-ink-muted">Cancellation fee</span>
          <div className="relative mt-1">
            <input
              type="number"
              defaultValue={5}
              min={0}
              max={100}
              step={0.5}
              className="h-10 w-full rounded-xl border border-line bg-background px-3 pr-9 text-sm text-ink outline-none focus:border-brand"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-muted">%</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Charged to the customer on a booking cancellation.</p>
        </label>
      </div>
    </div>
  );
}
