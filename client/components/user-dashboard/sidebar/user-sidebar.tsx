"use client";

import { LogOut } from "lucide-react";
import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PanelLeftIcon, PanelRightIcon } from "@hugeicons/core-free-icons";

import { GrabMyTicketLogoMark } from "@/icons/grabmyticket-logo";
import { USER_NAV_SECTIONS } from "@/constants/nav-items";
import { useActiveNav } from "@/hooks/use-active-nav";
import { useSidebar } from "@/hooks/use-sidebar";
import { useLogout } from "@/modules/auth/hooks/use-logout";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "@/components/dashboard/sidebar/sidebar-nav-item";
import { SidebarDownloadCard } from "@/components/dashboard/sidebar/sidebar-download-card";
import { PersonaSwitchButton } from "@/components/dashboard/sidebar/persona-switch-button";

/**
 * User-facing sidebar. Reuses the same nav item and download card
 * primitives as the organizer sidebar — only the nav sections differ.
 */
export function UserDashboardSidebar() {
  const { collapsed, toggle } = useSidebar();
  const logout = useLogout();

  const allItems = useMemo(
    () => USER_NAV_SECTIONS.flatMap((section) => section.items),
    [],
  );
  const activeId = useActiveNav(allItems);

  return (
    <aside
      className={cn(
        "sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 flex-col justify-between overflow-y-auto rounded-[28px] bg-sidebar p-4 text-sidebar-foreground shadow-lg transition-[width] duration-200 lg:flex",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      <div className="flex flex-col gap-6">
        {/* ── Logo ── */}
        {collapsed ? (
          <div className="group/logo relative flex items-center justify-center">
            <GrabMyTicketLogoMark className="size-9 rounded-xl transition-opacity duration-200 group-hover/logo:opacity-0" />
            <button
              type="button"
              onClick={toggle}
              aria-label="Expand sidebar"
              className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 transition-opacity duration-200 group-hover/logo:opacity-100 hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <HugeiconsIcon icon={PanelLeftIcon} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2.5">
              <GrabMyTicketLogoMark className="size-9 shrink-0 rounded-xl" />
              <span className="text-[16px] font-bold italic leading-none tracking-wide font-[family-name:var(--font-playfair)] whitespace-nowrap">
                GrabMyTicket
              </span>
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label="Collapse sidebar"
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <HugeiconsIcon icon={PanelRightIcon} />
            </button>
          </div>
        )}

        <div className="border-t border-sidebar-foreground/10 pt-3">
          <PersonaSwitchButton collapsed={collapsed} />
        </div>

        {/* ── Nav sections ── */}
        <nav className="flex flex-col gap-5">
          {USER_NAV_SECTIONS.map((section) => (
            <div key={section.title ?? "section"} className="flex flex-col gap-0.5">
              {section.title && !collapsed && (
                <p className="px-3 pb-1 text-xs font-medium uppercase tracking-widest text-sidebar-foreground/40">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  active={item.id === activeId}
                  collapsed={collapsed}
                />
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* ── Bottom ── */}
      <div className="flex flex-col gap-3">
        <SidebarDownloadCard collapsed={collapsed} />
        <button
          type="button"
          onClick={logout}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut className="size-[18px] shrink-0" />
          <span className={cn(collapsed && "sr-only")}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
