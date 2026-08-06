"use client";

import { useUIStore } from "@/store/ui-store";

/**
 * Thin, purpose-named wrapper around the shared UI store. Components that
 * only care about the sidebar don't need to know it happens to live in
 * `ui-store` alongside modal state — they depend on this hook's shape
 * instead, so the underlying store can be refactored freely.
 */
export function useSidebar() {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggle = useUIStore((state) => state.toggleSidebar);
  const setCollapsed = useUIStore((state) => state.setSidebarCollapsed);

  return { collapsed, toggle, setCollapsed };
}
