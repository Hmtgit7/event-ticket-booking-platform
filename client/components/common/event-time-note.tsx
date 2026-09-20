import { eventTimezoneDiffersFromViewer, formatEventDate, formatEventTime, getViewerTimezone } from "@/lib/events";
import { cn } from "@/lib/utils";

interface EventTimeNoteProps {
  startAt: string;
  endAt?: string;
  /** The event's own timezone (event.timezone) - null for pre-globalization events, in which case this renders nothing (see eventTimezoneDiffersFromViewer). */
  timezone: string | null;
  className?: string;
}

/**
 * "Your local time: ..." secondary line, shown only when it adds real
 * information - i.e. the viewer's browser timezone differs from the
 * event's own. Event times are always shown in the event's own timezone
 * everywhere else in the app (see lib/events.ts); this is the one place
 * that deliberately also shows the viewer's local equivalent, since a
 * booking decision is exactly the moment that comparison matters most.
 */
export function EventTimeNote({ startAt, endAt, timezone, className }: EventTimeNoteProps) {
  if (!eventTimezoneDiffersFromViewer(timezone)) return null;

  const viewerTimezone = getViewerTimezone();
  const localDate = formatEventDate(startAt, viewerTimezone);
  const localStart = formatEventTime(startAt, viewerTimezone);
  const localEnd = endAt ? formatEventTime(endAt, viewerTimezone) : null;

  return (
    <p className={cn("text-xs text-ink-muted", className)}>
      Your local time: {localDate}, {localStart}
      {localEnd ? ` – ${localEnd}` : ""}
    </p>
  );
}
