import type { EventLifecycleStatus } from "@/interfaces/event-api.interface";
import type { EventTabKey } from "@/types/dashboard.types";

/**
 * Every event carries its own IANA timezone (see event-service's
 * Event.timezone) - times are always shown in THAT timezone, never
 * silently converted to the viewer's local time, so a Mumbai event reads
 * "7:00 PM" the same way for an organizer in Mumbai and a customer
 * browsing from London. UTC is the fallback only for pre-globalization
 * events that predate this field (nullable - see EventResponse.timezone).
 */
const FALLBACK_TIMEZONE = "UTC";

/** The viewer's own IANA timezone (browser-resolved, no permission needed) - used only to decide whether a "your local time" secondary line is worth showing, never to format the event's own time. */
export function getViewerTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || FALLBACK_TIMEZONE;
  } catch {
    return FALLBACK_TIMEZONE;
  }
}

/** Whether a "your local time" line is worth rendering at all - skip it when the event's timezone matches the viewer's, since converting a time to itself is just noise. */
export function eventTimezoneDiffersFromViewer(eventTimezone: string | null): boolean {
  return !!eventTimezone && eventTimezone !== getViewerTimezone();
}

/** Short label for the timezone a time is shown in, e.g. "IST", "GMT+5:30" - lets a viewer tell at a glance which timezone a date/time belongs to, without having to infer it from the venue's city name. */
export function formatTimezoneAbbreviation(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" }).formatToParts(
    new Date(iso),
  );
  return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
}

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

/** Formats in the event's OWN timezone (never the viewer's local time) - pass event.timezone; falls back to UTC only for pre-globalization events that have none. */
export function formatEventDate(iso: string, timeZone?: string | null): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: timeZone || FALLBACK_TIMEZONE,
  }).format(new Date(iso));
}

/** Formats in the event's OWN timezone (never the viewer's local time) - pass event.timezone; falls back to UTC only for pre-globalization events that have none. */
export function formatEventTime(iso: string, timeZone?: string | null): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timeZone || FALLBACK_TIMEZONE,
  }).format(new Date(iso));
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
