"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { EventResponse } from "@/interfaces/event-api.interface";
import { formatEventDate, formatEventTime, formatTimezoneAbbreviation } from "@/lib/events";
import { EventTimeNote } from "@/components/common/event-time-note";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

interface EventAboutCardProps {
  event: EventResponse;
}

/** Roughly where a description starts overflowing a 5-line clamp - below this, showing a "Read more" toggle with nothing meaningful to expand is just noise. */
const LONG_DESCRIPTION_THRESHOLD = 320;

/**
 * Date/time/venue summary + description, with a District-style "Read more"
 * collapse for long descriptions. Collapsed by default only when the
 * description is actually long enough to need it.
 */
export function EventAboutCard({ event }: EventAboutCardProps) {
  const t = useTranslations("browse");
  const isLong = event.description.length > LONG_DESCRIPTION_THRESHOLD;
  const [expanded, setExpanded] = useState(!isLong);

  return (
    <div className="rounded-[24px] border border-line bg-canvas p-6 shadow-sm dark:bg-[#211b14]">
      <div className="grid gap-3 text-sm font-medium text-ink-muted sm:grid-cols-2">
        <p className="flex items-center gap-2">
          <Calendar className="size-4" />
          {formatEventDate(event.startAt, event.timezone)}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="size-4" />
          {formatEventTime(event.startAt, event.timezone)} – {formatEventTime(event.endAt, event.timezone)}
          {event.timezone && <span className="text-xs">{formatTimezoneAbbreviation(event.startAt, event.timezone)}</span>}
        </p>
        <p className="flex items-center gap-2 sm:col-span-2">
          <MapPin className="size-4" />
          {event.venueName}, {event.address}, {event.city}
        </p>
      </div>

      <EventTimeNote startAt={event.startAt} endAt={event.endAt} timezone={event.timezone} className="mt-2" />

      <p className={cn("mt-5 whitespace-pre-line text-base leading-7 text-ink-muted", !expanded && "line-clamp-5")}>
        {event.description}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-sm font-bold text-brand hover:underline"
        >
          {expanded ? t("readLess", "Read less") : t("readMore", "Read more")}
        </button>
      )}
    </div>
  );
}
