"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { UserTableRow } from "@/components/admin-dashboard/users/user-table-row";
import { ADMIN_USERS } from "@/constants/admin-dashboard-data";
import { cn } from "@/lib/utils";

type RoleFilter = "All" | "user" | "organizer";
type StatusFilter = "All" | "Active" | "Suspended" | "Pending";

/** Admin users page — searchable, filterable user list with role and status controls. */
export function AdminUsersContainer() {
  const [query,         setQuery]         = useState("");
  const [roleFilter,    setRoleFilter]    = useState<RoleFilter>("All");
  const [statusFilter,  setStatusFilter]  = useState<StatusFilter>("All");

  const visible = ADMIN_USERS.filter((u) => {
    const q = query.trim().toLowerCase();
    if (q && !`${u.name} ${u.email}`.toLowerCase().includes(q)) return false;
    if (roleFilter   !== "All" && u.role   !== roleFilter)   return false;
    if (statusFilter !== "All" && u.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AdminSectionTitle eyebrow="Management" title="Users" />
          <div className="flex flex-wrap gap-2">
            {(["All", "user", "organizer"] as RoleFilter[]).map((r) => (
              <button key={r} type="button" onClick={() => setRoleFilter(r)}
                className={cn("rounded-full border px-3 py-1 text-xs font-semibold capitalize transition",
                  roleFilter === r ? "border-brand bg-brand text-brand-foreground" : "border-line bg-background text-ink hover:border-brand"
                )}>
                {r === "user" ? "Users" : r === "organizer" ? "Organizers" : "All"}
              </button>
            ))}
            {(["All", "Active", "Suspended", "Pending"] as StatusFilter[]).map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)}
                className={cn("rounded-full border px-3 py-1 text-xs font-semibold transition",
                  statusFilter === s ? "border-brand bg-brand text-brand-foreground" : "border-line bg-background text-ink hover:border-brand"
                )}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Search ── */}
        <label className="relative mt-4 block max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="h-10 w-full rounded-xl border border-line bg-background pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-brand"
          />
        </label>
      </div>

      {/* ── Table ── */}
      <div className="flex flex-col gap-2">
        {visible.length === 0
          ? <p className="rounded-2xl border border-line bg-surface py-12 text-center text-sm text-ink-muted">No users match your filters.</p>
          : visible.map((user) => <UserTableRow key={user.id} user={user} />)
        }
      </div>
    </div>
  );
}
