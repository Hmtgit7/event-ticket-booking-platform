"use client";

import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { OrderRow } from "@/components/user-dashboard/orders/order-row";
import { OrderListSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { NoOrdersIllustration } from "@/icons/empty-state-icons";
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
          <OrderListSkeleton count={4} />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<NoOrdersIllustration className="size-28" />}
            title={filter === "All" ? "No orders yet" : "No orders match this filter"}
            description={
              filter === "All"
                ? "Book your first ticket and it'll show up here."
                : "Try a different status filter, or check back later."
            }
            action={filter === "All" ? { label: "Explore events", href: "/user/dashboard/explore" } : undefined}
          />
        ) : (
          visible.map((order) => <OrderRow key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
