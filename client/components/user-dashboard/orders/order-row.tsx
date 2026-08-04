import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderItem } from "@/constants/user-dashboard-data";

interface OrderRowProps {
  order: OrderItem;
}

const statusClasses: Record<OrderItem["status"], string> = {
  Confirmed: "text-positive border-positive/30 bg-positive/10",
  Pending:   "text-ink-muted border-line bg-surface-hover",
  Cancelled: "text-destructive border-destructive/30 bg-destructive/10",
};

/**
 * A single row in the order history list. Shows the order ID, event
 * name, date/tickets/amount, a status badge, and a download CTA.
 */
export function OrderRow({ order }: OrderRowProps) {
  return (
    <article className="grid gap-3 rounded-2xl border border-line bg-background p-4 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="text-xs font-bold uppercase text-ink-muted">{order.id}</p>
        <h3 className="mt-1 text-base font-bold text-ink">{order.event}</h3>
        <p className="mt-0.5 text-sm text-ink-muted">
          {order.date} · {order.tickets} · {order.amount}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-lg border px-3 py-1.5 text-xs font-bold",
            statusClasses[order.status],
          )}
        >
          {order.status}
        </span>
        <Button variant="outline" size="sm">
          <Download className="size-3.5" />
          Ticket
        </Button>
      </div>
    </article>
  );
}
