import type { ReactNode } from "react";
import type { NavItem } from "@/interfaces/nav.interface";
import { SettingsNav } from "./settings-nav";

interface SettingsShellProps {
  navItems: NavItem[];
  children: ReactNode;
}

/**
 * Two-column Settings layout — tab rail + content. Shared between
 * /dashboard/settings/* (organizer) and /user/dashboard/profile/*
 * (customer) so both personas render identical settings chrome; only
 * the nav items and the tab content passed in differ.
 */
export function SettingsShell({ navItems, children }: SettingsShellProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-2xl border border-line bg-surface p-3 shadow-sm">
        <SettingsNav items={navItems} />
      </aside>

      <div className="flex min-w-0 flex-col gap-5">{children}</div>
    </div>
  );
}
