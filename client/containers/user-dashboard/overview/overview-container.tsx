"use client";

import { StatCard } from "@/components/user-dashboard/widgets/stat-card";
import { NextTicketCard } from "@/components/user-dashboard/widgets/next-ticket-card";
import { NotificationList } from "@/components/user-dashboard/widgets/notification-list";
import { DUMMY_ORDERS } from "@/constants/user-dashboard-data";

const STATS = [
  { label: "Upcoming tickets", value: "3",   meta: "Next check-in in 12 days",    metaVariant: "positive" as const },
  { label: "Saved events",     value: "8",   meta: "Music and outdoor picks",      metaVariant: "muted"    as const },
  { label: "Wallet credit",    value: "$17", meta: "Promo + refund balance",       metaVariant: "brand"    as const },
  { label: "Open support",     value: "1",   meta: "Reply expected today",         metaVariant: "muted"    as const },
];

/**
 * Overview page container — summary stats, the next upcoming ticket hero,
 * and the attention-needed notifications panel.
 */
export function OverviewContainer() {
  const nextOrder = DUMMY_ORDERS[0];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Stats row ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            meta={stat.meta}
            metaVariant={stat.metaVariant}
          />
        ))}
      </div>

      {/* ── Hero + notifications ── */}
      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <NextTicketCard order={nextOrder} />
        <NotificationList />
      </div>

      {/* ── Member pass ── */}
      <article className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Member pass
        </p>
        <p className="mt-2 text-3xl font-black text-ink">Gold</p>
        <p className="mt-1 text-sm text-ink-muted">
          2,450 reward points ready for your next booking.
        </p>
      </article>
    </div>
  );
}
