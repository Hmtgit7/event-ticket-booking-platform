"use client";

import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { OrderRow } from "@/components/user-dashboard/orders/order-row";
import { bookingService } from "@/services/booking.service";
import { cn } from "@/lib/utils";
import type { BookingResponse, BookingStatus } from "@/interfaces/booking-api.interface";

const STATUS_FILTERS = ["All", "CONFIRMED", "PENDING", "CANCELLED"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const FILTER_LABEL: Record<StatusFilter, string> = {
  All: "All",
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
};

/**
 * Order history page — filterable list of all past and upcoming ticket
 * purchases, backed by booking-service.
 */
export function OrdersContainer() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("All");

  useEffect(() => {
    let cancelled = false;
    bookingService
      .myBookings(0, 20)
      .then((result) => {
        if (!cancelled) setBookings(result.items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible =
    filter === "All" ? bookings : bookings.filter((booking) => booking.status === (filter as BookingStatus));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle eyebrow="Orders" title="Tickets & booking history" />

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                filter === status
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-line bg-background text-ink hover:border-brand",
              )}
            >
              {FILTER_LABEL[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <p className="rounded-2xl border border-line bg-surface px-5 py-10 text-center text-sm text-ink-muted">
            Loading orders…
          </p>
        ) : visible.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface px-5 py-10 text-center text-sm text-ink-muted">
            No orders match this filter.
          </p>
        ) : (
          visible.map((order) => <OrderRow key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
