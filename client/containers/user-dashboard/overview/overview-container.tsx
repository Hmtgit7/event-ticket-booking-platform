"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/user-dashboard/widgets/stat-card";
import { NextTicketCard } from "@/components/user-dashboard/widgets/next-ticket-card";
import { NotificationList } from "@/components/user-dashboard/widgets/notification-list";
import { Skeleton } from "@/components/ui/skeleton";
import { bookingService } from "@/services/booking.service";
import type { BookingResponse } from "@/interfaces/booking-api.interface";

const STATS = [
  { label: "Upcoming tickets", value: "3",   meta: "Next check-in in 12 days",    metaVariant: "positive" as const },
  { label: "Saved events",     value: "8",   meta: "Music and outdoor picks",      metaVariant: "muted"    as const },
  { label: "Wallet credit",    value: "$17", meta: "Promo + refund balance",       metaVariant: "brand"    as const },
  { label: "Open support",     value: "1",   meta: "Reply expected today",         metaVariant: "muted"    as const },
];

/**
 * Overview page container — summary stats, the next upcoming ticket hero,
 * and the attention-needed notifications panel. The stats row above is
 * still placeholder data (no aggregate endpoints exist yet); the hero card
 * is real, backed by booking-service.
 */
export function OverviewContainer() {
  const [latestBooking, setLatestBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    bookingService
      .myBookings(0, 1)
      .then((result) => {
        if (!cancelled) setLatestBooking(result.items[0] ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
        {loading ? (
          <div className="flex h-72 flex-col justify-between rounded-2xl border border-line bg-surface p-5">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : latestBooking ? (
          <NextTicketCard order={latestBooking} />
        ) : (
          <div className="flex h-72 flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-surface text-center">
            <p className="text-sm font-semibold text-ink">No bookings yet</p>
            <p className="text-sm text-ink-muted">Explore events to get your first ticket.</p>
          </div>
        )}
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
