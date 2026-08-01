"use client";

import { Bell, Mail, Menu, Search } from "lucide-react";
import { Avatar } from "@/components/common/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSidebar } from "@/hooks/use-sidebar";

interface DashboardTopbarProps {
  section: string;
  crumb: string;
}

const CURRENT_USER = { name: "Shareef Deen", email: "shareefdeen20@gmail.com" };

/** Sticky top bar: breadcrumb + search on the left, quick actions (theme
 * toggle, messages, notifications) and the signed-in user on the right.
 * `section`/`crumb` come from the route so this stays a dumb, reusable
 * shell shared by every dashboard page. */
export function DashboardTopbar({ section, crumb }: DashboardTopbarProps) {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-4 z-10 flex items-center gap-4 rounded-[28px] bg-surface/95 px-4 py-3.5 shadow-sm backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle sidebar"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink lg:hidden"
      >
        <Menu className="size-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-ink-muted">{section}</p>
        <h1 className="truncate text-xl font-bold text-ink">{crumb}</h1>
      </div>

      <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-ink-muted md:flex">
        <Search className="size-4" />
        <input
          type="search"
          placeholder="Search"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <IconButton icon={Mail} label="Messages" />
        <IconButton icon={Bell} label="Notifications" />
        <div className="ml-1 hidden items-center gap-2 sm:flex">
          <Avatar name={CURRENT_USER.name} className="size-10" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-ink">{CURRENT_USER.name}</p>
            <p className="truncate text-xs text-ink-muted">{CURRENT_USER.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function IconButton({ icon: Icon, label }: { icon: typeof Bell; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand"
    >
      <Icon className="size-[18px]" />
    </button>
  );
}
