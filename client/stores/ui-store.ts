import { create } from "zustand";

/**
 * Client-only UI state. Does NOT belong here: events, bookings, tickets,
 * or anything that lives in a Spring service — that's server state and
 * goes through TanStack Query (see lib/query-client.tsx + lib/api-client.ts)
 * instead, so it gets caching/refetching/invalidation for free.
 *
 * Zustand is for things only the browser knows about: is the sidebar
 * collapsed, which step of the booking wizard is active, is a modal open.
 */
interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
