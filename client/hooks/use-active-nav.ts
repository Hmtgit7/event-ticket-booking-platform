"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { NavItem } from "@/interfaces/nav.interface";

/**
 * Resolves which nav item matches the current route. Exact match wins;
 * falls back to the longest `matchPrefix` item so nested routes like
 * /dashboard/events/123 still highlight "Events".
 */
export function useActiveNav(items: NavItem[]): string | null {
  const pathname = usePathname() ?? "";

  return useMemo(() => {
    const exact = items.find((item) => item.href === pathname);
    if (exact) return exact.id;

    const prefixMatches = items
      .filter((item) => item.matchPrefix && pathname.startsWith(item.href))
      .sort((a, b) => b.href.length - a.href.length);

    return prefixMatches[0]?.id ?? null;
  }, [items, pathname]);
}

