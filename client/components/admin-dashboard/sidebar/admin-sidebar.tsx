"use client";

import { LogOut } from "lucide-react";
import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PanelLeftIcon, PanelRightIcon } from "@hugeicons/core-free-icons";

import { GrabMyTicketLogoMark } from "@/icons/grabmyticket-logo";
import { ADMIN_NAV_SECTIONS } from "@/constants/nav-items";
import { useActiveNav } from "@/hooks/use-active-nav";
import { useSidebar } from "@/hooks/use-sidebar";
import { useLogout } from "@/modules/auth/hooks/use-logout";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "@/components/dashboard/sidebar/sidebar-nav-item";

/**
 * Super-admin sidebar. Reuses the same nav-item primitive as the
 * organizer sidebar — only ADMIN_NAV_SECTIONS differ. The download card
 * is omitted here since admins don't need the mobile app promo.
 */
export function AdminDashboardSidebar() {
  const { collapsed, toggle } = useSidebar();
  const logout = useLogout();

  const allItems = useMemo(
    () => ADMIN_NAV_SECTIONS.flatMap((s) => s.items),
    [],
  );
  const activeId = useActiveNav(allItems);

  return (
    <aside
      className={cn(
        "sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 flex-col rounded-[28px] bg-sidebar p-4 text-sidebar-foreground shadow-lg transition-[width] duration-200 lg:flex overflow-hidden",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      {/* ── Logo header — fixed height aligned with topbar ── */}
      {collapsed ? (
        <div className="group/logo relative flex shrink-0 items-center justify-center py-3.5">
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
        <div className="flex shrink-0 items-center justify-between gap-2 px-1 py-3.5">
          <div className="flex items-center gap-2.5">
            <GrabMyTicketLogoMark className="size-9 shrink-0 rounded-xl" />
            <div className="leading-tight">
              <span className="block text-[15px] font-bold italic font-[family-name:var(--font-playfair)]">
                GrabMyTicket
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                Admin
              </span>
            </div>
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

      {/* ── Nav sections — scrollable middle zone ── */}
      <nav className="sidebar-scroll mt-4 flex flex-1 flex-col gap-5 overflow-y-auto py-1">
        {ADMIN_NAV_SECTIONS.map((section) => (
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

      {/* ── Logout — pinned to bottom, never scrolls ── */}
      <div className="mt-3 shrink-0">
        <button
          type="button"
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
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
