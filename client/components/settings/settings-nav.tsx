"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { useActiveNav } from "@/hooks/use-active-nav";
import type { NavItem } from "@/interfaces/nav.interface";

interface SettingsNavProps {
  items: NavItem[];
}

/**
 * Tab navigation for the Settings hub. Renders real routed links (not
 * client-side tab state) so each section has its own URL — shared
 * between the organizer and customer dashboards so both personas render
 * identical settings chrome. See ORGANIZER_SETTINGS_NAV_ITEMS /
 * USER_SETTINGS_NAV_ITEMS in constants/nav-items.ts.
 */
export function SettingsNav({ items }: SettingsNavProps) {
  const activeId = useActiveNav(items);

  return (
    <nav
      className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
      aria-label="Settings sections"
    >
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition",
              active
                ? "bg-brand text-brand-foreground"
                : "text-ink-muted hover:bg-surface-hover hover:text-ink",
            )}
          >
            <HugeiconsIcon icon={item.icon} size={17} strokeWidth={1.8} className="shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
