import Link from "next/link";
import { Ticket } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatEventDate } from "@/lib/events";
import type { BookingResponse } from "@/interfaces/booking-api.interface";

interface OrderRowProps {
  order: BookingResponse;
}

const STATUS_CLASSES: Record<BookingResponse["status"], string> = {
  CONFIRMED: "text-positive border-positive/30 bg-positive/10",
  PENDING: "text-ink-muted border-line bg-surface-hover",
  CANCELLED: "text-destructive border-destructive/30 bg-destructive/10",
  FAILED: "text-destructive border-destructive/30 bg-destructive/10",
};

const STATUS_LABEL: Record<BookingResponse["status"], string> = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
};

/**
 * A single row in the order history list. Shows the booking code, event
 * name, date/tickets/amount, a status badge, and a "View ticket" link.
 */
export function OrderRow({ order }: OrderRowProps) {
  return (
    <article className="grid gap-3 rounded-2xl border border-line bg-background p-4 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="text-xs font-bold uppercase text-ink-muted">{order.bookingCode}</p>
        <h3 className="mt-1 text-base font-bold text-ink">{order.eventTitle}</h3>
        <p className="mt-0.5 text-sm text-ink-muted">
          {formatEventDate(order.eventStartAt)} · {order.quantity} × {order.ticketTypeName} · $
          {order.totalAmount.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-lg border px-3 py-1.5 text-xs font-bold", STATUS_CLASSES[order.status])}>
          {STATUS_LABEL[order.status]}
        </span>
        <Link href={`/user/dashboard/orders/${order.id}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          <Ticket className="size-3.5" />
          View ticket
        </Link>
      </div>
    </article>
  );
}
