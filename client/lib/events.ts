import type { EventLifecycleStatus } from "@/interfaces/event-api.interface";
import type { EventTabKey } from "@/types/dashboard.types";

/** Which dashboard tab (Active / Past / Draft) an event belongs in, derived from real status + dates - not a stored field. */
export function deriveEventTab(status: EventLifecycleStatus, endAt: string): EventTabKey {
  if (status === "DRAFT") return "draft";
  if (status === "PUBLISHED" && new Date(endAt) >= new Date()) return "active";
  return "past"; // PUBLISHED-but-ended, COMPLETED, or CANCELLED
}

export const STATUS_BADGE: Record<EventLifecycleStatus, { label: string; dotClass: string }> = {
  DRAFT: { label: "Draft", dotClass: "bg-ink-muted" },
  PUBLISHED: { label: "Published", dotClass: "bg-positive" },
  CANCELLED: { label: "Cancelled", dotClass: "bg-brand" },
  COMPLETED: { label: "Completed", dotClass: "bg-ink-muted" },
};

export function formatEventDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(iso),
  );
}

export function formatEventTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

export function ticketsSoldPct(totalSold: number, totalCapacity: number): number {
  if (totalCapacity <= 0) return 0;
  return Math.round((totalSold / totalCapacity) * 100);
}

export function formatPrice(fromPrice: number | null): string {
  if (fromPrice === null) return "—";
  if (fromPrice === 0) return "Free";
  return `$${fromPrice.toFixed(2)}`;
}
