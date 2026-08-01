"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/interfaces/nav.interface";

interface SidebarNavItemProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}

export function SidebarNavItem({ item, active, collapsed }: SidebarNavItemProps) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group/nav flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors",
        collapsed ? "justify-center px-0" : "gap-3 px-3",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
      )}
    >
      <HugeiconsIcon
        icon={item.icon}
        size={19}
        strokeWidth={1.8}
        className="shrink-0"
      />
      <span className={cn("truncate transition-all", collapsed && "sr-only")}>
        {item.label}
      </span>
    </Link>
  );
}
