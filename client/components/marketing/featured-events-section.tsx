"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { eventService } from "@/services/event.service";
import { formatEventDate, formatEventTime } from "@/lib/events";

export function FeaturedEventsSection() {
  const [events, setEvents] = useState<EventSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    eventService
      .publicEvents({ page: 0, size: 3 })
      .then((result) => {
        if (!cancelled) setEvents(result.items);
      })
      .catch(() => {
        // Homepage teaser - fail quietly, the full /events page is the real experience.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && events.length === 0) return null;

  return (
    <section className="border-b border-line bg-canvas py-16 sm:py-20 dark:bg-[#0f0c08]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Public discovery</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">Browse events people can book today.</h2>
          </div>
          <Link href="/events" className="inline-flex items-center gap-2 text-sm font-bold text-brand">
            View all events
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[22rem] animate-pulse rounded-[24px] bg-surface dark:bg-[#1c1711]" />
              ))
            : events.map((event) => {
                const visual = CATEGORY_VISUAL[event.category as EventCategory];
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="overflow-hidden rounded-[24px] border border-line bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:bg-[#1c1711] dark:shadow-black/25"
                  >
                    <div
                      className="h-56 bg-cover bg-center"
                      style={{
                        background: event.bannerImageUrl
                          ? `url(${event.bannerImageUrl}) center/cover`
                          : `linear-gradient(160deg, ${visual?.from ?? "#242424"}, ${visual?.to ?? "#0a0a0a"})`,
                      }}
                    />
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{event.category}</p>
                      <h3 className="mt-2 text-xl font-bold text-ink">{event.title}</h3>
                      <div className="mt-4 space-y-2 text-sm font-medium text-ink-muted">
                        <p className="flex items-center gap-2">
                          <Calendar className="size-4" />
                          {formatEventDate(event.startAt)} · {formatEventTime(event.startAt)}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="size-4" />
                          {event.venueName}, {event.city}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
