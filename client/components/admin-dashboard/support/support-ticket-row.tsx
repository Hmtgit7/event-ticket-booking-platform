import { StatusBadge } from "@/components/admin-dashboard/widgets/status-badge";
import type { AdminSupportTicket } from "@/constants/admin-dashboard-data";

interface SupportTicketRowProps {
  ticket: AdminSupportTicket;
}

const statusVariant: Record<AdminSupportTicket["status"], "red" | "yellow" | "green"> = {
  "Open":        "red",
  "In Progress": "yellow",
  "Resolved":    "green",
};

const priorityVariant: Record<AdminSupportTicket["priority"], "red" | "yellow" | "muted"> = {
  High:   "red",
  Medium: "yellow",
  Low:    "muted",
};

/**
 * Single row in the admin support ticket list.
 */
export function SupportTicketRow({ ticket }: SupportTicketRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-line bg-background px-4 py-3 sm:grid-cols-[auto_1fr_auto_auto_auto]">
      <p className="hidden text-xs font-mono text-ink-muted sm:block">{ticket.id}</p>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{ticket.subject}</p>
        <p className="mt-0.5 truncate text-xs text-ink-muted">
          {ticket.user} · {ticket.category} · {ticket.created}
        </p>
      </div>

      <StatusBadge label={ticket.priority} variant={priorityVariant[ticket.priority]} />
      <StatusBadge label={ticket.status}   variant={statusVariant[ticket.status]} />
    </div>
  );
}
