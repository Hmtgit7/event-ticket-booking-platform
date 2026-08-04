"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DUMMY_PROMOS, type PromoCode } from "@/constants/promotions-data";
import { cn } from "@/lib/utils";

const statusVariant: Record<PromoCode["status"], string> = {
  Active:  "bg-positive/10 text-positive border-positive/25",
  Expired: "bg-ink/5 text-ink-muted border-line",
  Paused:  "bg-yellow-500/10 text-yellow-600 border-yellow-400/25 dark:text-yellow-400",
};

/** Organizer promotions & coupon-codes page. */
export function PromotionsContainer() {
  const [promos] = useState<PromoCode[]>(DUMMY_PROMOS);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Discounts</p>
          <h1 className="mt-1 font-heading text-2xl font-extrabold text-ink">Promotions</h1>
          <p className="mt-1 text-sm text-ink-muted">Create and manage promo codes for your events.</p>
        </div>
        <Button size="lg">
          <Plus className="size-4" />
          New promo code
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active codes",   value: String(promos.filter((p) => p.status === "Active").length) },
          { label: "Total uses",     value: String(promos.reduce((s, p) => s + p.usesCount, 0)) },
          { label: "Est. discount",  value: "~$480" },
        ].map(({ label, value }) => (
          <article key={label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="mt-2 text-3xl font-black text-ink">{value}</p>
          </article>
        ))}
      </div>

      {/* ── Promo list ── */}
      <div className="flex flex-col gap-3">
        {promos.map((promo) => (
          <div key={promo.id} className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[auto_1fr_auto_auto_auto]">
            <code className="rounded-lg border border-line bg-background px-3 py-1.5 text-sm font-bold text-ink">
              {promo.code}
            </code>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{promo.event}</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {promo.discount} off · {promo.usesCount}/{promo.usesLimit} uses · Expires {promo.expiresAt}
              </p>
            </div>
            <div className="hidden items-center sm:flex">
              <div className="h-2 w-28 overflow-hidden rounded-full bg-line">
                <div className="h-2 rounded-full bg-brand" style={{ width: `${(promo.usesCount / promo.usesLimit) * 100}%` }} />
              </div>
            </div>
            <span className={cn("hidden rounded-lg border px-2.5 py-1 text-xs font-semibold sm:inline-flex", statusVariant[promo.status])}>
              {promo.status}
            </span>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
