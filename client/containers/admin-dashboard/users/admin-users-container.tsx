"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { UserTableRow } from "@/components/admin-dashboard/users/user-table-row";
import { EmptyState } from "@/components/common/empty-state";
import { NoResultsIllustration } from "@/icons/empty-state-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { adminUsersService } from "@/services/admin-users.service";
import { cn } from "@/lib/utils";
import type { AdminUserSummary } from "@/interfaces/admin-user-api.interface";

type RoleFilter = "All" | "ROLE_USER" | "ROLE_ORGANIZER";
type StatusFilter = "All" | "Active" | "Suspended";

/** Admin users page - searchable, filterable user list with real suspend/reinstate actions wired to auth-service. Search is server-side (debounced) since the full user list isn't fetched client-side. */
export function AdminUsersContainer() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AdminSectionTitle eyebrow="Management" title="Users" />
          <div className="flex flex-wrap gap-2">
            {(["All", "ROLE_USER", "ROLE_ORGANIZER"] as RoleFilter[]).map((r) => (
              <button key={r} type="button" onClick={() => setRoleFilter(r)}
                className={cn("rounded-full border px-3 py-1 text-xs font-semibold capitalize transition",
                  roleFilter === r ? "border-brand bg-brand text-brand-foreground" : "border-line bg-background text-ink hover:border-brand"
                )}>
                {r === "ROLE_USER" ? "Users" : r === "ROLE_ORGANIZER" ? "Organizers" : "All"}
              </button>
            ))}
            {(["All", "Active", "Suspended"] as StatusFilter[]).map((s) => (
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

      <AdminUsersList key={debouncedQuery} debouncedQuery={debouncedQuery} roleFilter={roleFilter} statusFilter={statusFilter} />
    </div>
  );
}

function AdminUsersList({ debouncedQuery, roleFilter, statusFilter }: { debouncedQuery: string; roleFilter: RoleFilter; statusFilter: StatusFilter }) {
  const [users, setUsers] = useState<AdminUserSummary[] | null>(null);

  useEffect(() => {
    adminUsersService.listUsers(debouncedQuery).then((res) => setUsers(res.items));
  }, [debouncedQuery]);

  async function handleSuspend(id: string, reason: string) {
    await adminUsersService.suspendUser(id, reason);
    setUsers((prev) => (prev ?? []).map((u) => (u.id === id ? { ...u, enabled: false } : u)));
  }

  async function handleReinstate(id: string) {
    await adminUsersService.reinstateUser(id);
    setUsers((prev) => (prev ?? []).map((u) => (u.id === id ? { ...u, enabled: true } : u)));
  }

  const visible = (users ?? []).filter((u) => {
    if (roleFilter !== "All" && !u.roles.includes(roleFilter)) return false;
    if (statusFilter !== "All" && (statusFilter === "Active") !== u.enabled) return false;
    return true;
  });

  return (
    <>
      {users === null ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.length === 0
            ? <EmptyState icon={<NoResultsIllustration className="size-24" />} title="No users match your filters" description="Try a different search term or filter combination." />
            : visible.map((user) => (
                <UserTableRow key={user.id} user={user} onSuspend={handleSuspend} onReinstate={handleReinstate} />
              ))
          }
        </div>
      )}
    </>
  );
}
