import { StatusBadge } from "@/components/admin-dashboard/widgets/status-badge";
import type { AdminEvent } from "@/constants/admin-dashboard-data";

interface EventTableRowProps {
  event: AdminEvent;
}

const statusVariant: Record<AdminEvent["status"], "green" | "muted" | "red" | "blue"> = {
  Live:    "green",
  Draft:   "muted",
  Flagged: "red",
  Ended:   "blue",
};

/**
 * Single row in the admin events table.
 */
export function EventTableRow({ event }: EventTableRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-xl border border-line bg-background px-4 py-3 sm:grid-cols-[1fr_auto_auto_auto_auto]">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{event.title}</p>
        <p className="mt-0.5 truncate text-xs text-ink-muted">
          {event.organizer} · {event.category}
        </p>
      </div>

      <p className="hidden text-xs text-ink-muted sm:block">{event.date}</p>

      <p className="hidden text-xs font-semibold text-ink sm:block">
        {event.ticketsSold.toLocaleString()} sold
      </p>

      <p className="hidden text-xs font-semibold text-positive sm:block">
        {event.revenue}
      </p>

      <StatusBadge label={event.status} variant={statusVariant[event.status]} />
    </div>
  );
}
