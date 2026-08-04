import { StatusBadge } from "@/components/admin-dashboard/widgets/status-badge";
import type { AdminBooking } from "@/constants/admin-dashboard-data";

interface BookingTableRowProps {
  booking: AdminBooking;
}

const statusVariant: Record<AdminBooking["status"], "green" | "yellow" | "blue" | "red"> = {
  Confirmed: "green",
  Pending:   "yellow",
  Refunded:  "blue",
  Cancelled: "red",
};

/**
 * Single row in the admin bookings monitor table.
 */
export function BookingTableRow({ booking }: BookingTableRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-xl border border-line bg-background px-4 py-3 sm:grid-cols-[auto_1fr_1fr_auto_auto_auto]">
      <p className="hidden text-xs font-mono text-ink-muted sm:block">{booking.id}</p>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{booking.user}</p>
        <p className="mt-0.5 truncate text-xs text-ink-muted">{booking.event}</p>
      </div>

      <div className="hidden min-w-0 sm:block">
        <p className="text-xs text-ink-muted">{booking.date}</p>
        <p className="text-xs font-medium text-ink">{booking.tickets}</p>
      </div>

      <p className="text-sm font-bold text-ink">{booking.amount}</p>

      <StatusBadge label={booking.status} variant={statusVariant[booking.status]} />
    </div>
  );
}
