"use client";

import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { OrderRow } from "@/components/user-dashboard/orders/order-row";
import { DUMMY_ORDERS } from "@/constants/user-dashboard-data";

const STATUS_FILTERS = ["All", "Confirmed", "Pending", "Cancelled"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Order history page — filterable list of all past and upcoming ticket
 * purchases.
 */
export function OrdersContainer() {
  const [filter, setFilter] = useState<StatusFilter>("All");

  const visible = filter === "All"
    ? DUMMY_ORDERS
    : DUMMY_ORDERS.filter((o) => o.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle eyebrow="Orders" title="Tickets & booking history" />

        {/* Filter pills */}
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
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {visible.length === 0 ? (
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
