import { Avatar } from "@/components/common/avatar";
import { StatusBadge } from "@/components/admin-dashboard/widgets/status-badge";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/constants/admin-dashboard-data";

interface UserTableRowProps {
  user: AdminUser;
}

const statusVariant: Record<AdminUser["status"], "green" | "red" | "yellow"> = {
  Active:    "green",
  Suspended: "red",
  Pending:   "yellow",
};

const roleClasses: Record<AdminUser["role"], string> = {
  user:      "bg-ink/5 text-ink-muted",
  organizer: "bg-brand/10 text-brand",
};

/**
 * Single row in the admin users table.
 */
export function UserTableRow({ user }: UserTableRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 rounded-xl border border-line bg-background px-4 py-3">
      <Avatar name={user.name} className="size-9 text-xs" />

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
        <p className="truncate text-xs text-ink-muted">{user.email}</p>
      </div>

      <span className={cn("rounded-lg px-2.5 py-1 text-xs font-semibold capitalize", roleClasses[user.role])}>
        {user.role}
      </span>

      <p className="hidden text-xs text-ink-muted sm:block">{user.joined}</p>

      <StatusBadge label={user.status} variant={statusVariant[user.status]} />
    </div>
  );
}
