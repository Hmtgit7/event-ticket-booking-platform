"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { MockMap } from "@/components/common/mock-map";
import type { EventResponse } from "@/interfaces/event-api.interface";
import { eventService } from "@/services/event.service";
import { ApiError } from "@/lib/api-client";
import { formatEventDate, formatEventTime, formatPrice } from "@/lib/events";

interface PublicEventDetailProps {
  slug: string;
}

export function PublicEventDetail({ slug }: PublicEventDetailProps) {
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    let cancelled = false;
    eventService
      .publicEventBySlug(slug)
      .then((result) => {
        if (!cancelled) setEvent(result);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFoundFlag(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (notFoundFlag) notFound();

  if (loading) {
    return (
      <MarketingLayout>
        <div className="mx-auto max-w-4xl px-4 py-24 text-center text-sm text-ink-muted">Loading event…</div>
      </MarketingLayout>
    );
  }

  if (!event) {
    return (
      <MarketingLayout>
        <div className="mx-auto max-w-4xl px-4 py-24 text-center text-sm text-brand">
          Couldn&apos;t load this event. Please try again.
        </div>
      </MarketingLayout>
    );
  }

  const visual = CATEGORY_VISUAL[event.category as EventCategory];
  const location = {
    venue: event.venueName,
    city: event.city,
    lat: event.latitude ?? 0,
    lng: event.longitude ?? 0,
  };

  return (
    <MarketingLayout>
      <section className="bg-canvas px-3 py-3 sm:px-5 sm:py-5 dark:bg-[#0d0a07]">
        <div
          className="relative h-72 overflow-hidden rounded-[30px] bg-cover bg-center sm:h-96"
          style={{
            background: event.bannerImageUrl
              ? `url(${event.bannerImageUrl}) center/cover`
              : `linear-gradient(160deg, ${visual?.from ?? "#242424"}, ${visual?.to ?? "#0a0a0a"})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute left-5 top-5 rounded-xl bg-black/55 px-3 py-1.5 text-xs font-bold text-on-elevated backdrop-blur">
            {event.category}
          </div>
          <div className="absolute bottom-6 left-5 right-5 text-on-elevated sm:left-8 sm:right-8">
            <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">{event.title}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="rounded-[24px] border border-line bg-canvas p-6 shadow-sm dark:bg-[#211b14]">
            <div className="grid gap-3 text-sm font-medium text-ink-muted sm:grid-cols-2">
              <p className="flex items-center gap-2"><Calendar className="size-4" />{formatEventDate(event.startAt)}</p>
              <p className="flex items-center gap-2"><Clock className="size-4" />{formatEventTime(event.startAt)} – {formatEventTime(event.endAt)}</p>
              <p className="flex items-center gap-2 sm:col-span-2"><MapPin className="size-4" />{event.venueName}, {event.address}, {event.city}</p>
            </div>
            <p className="mt-5 whitespace-pre-line text-base leading-7 text-ink-muted">{event.description}</p>
          </div>

          <div className="rounded-[24px] border border-line bg-canvas p-6 shadow-sm dark:bg-[#211b14]">
            <h2 className="mb-3 text-lg font-bold text-ink">Location</h2>
            <MockMap location={location} className="h-64" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[24px] border border-line bg-canvas p-6 shadow-sm dark:bg-[#211b14]">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
              <Ticket className="size-5 text-brand" /> Tickets
            </h2>
            <div className="flex flex-col divide-y divide-line">
              {event.ticketTypes.map((tier) => {
                const seatsLeft = tier.quantityAvailable;
                const soldOut = seatsLeft <= 0;
                return (
                  <div key={tier.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{tier.name}</p>
                      <p className="text-xs text-ink-muted">{soldOut ? "Sold out" : `${seatsLeft} seats left`}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-ink">{formatPrice(tier.price)}</span>
                      <Link
                        href="/auth/login"
                        aria-disabled={soldOut}
                        className={`rounded-xl px-4 py-2 text-sm font-bold text-brand-foreground ${
                          soldOut ? "pointer-events-none bg-ink-muted/40" : "bg-brand"
                        }`}
                      >
                        {soldOut ? "Sold out" : "Get ticket"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-ink-muted">Sign in to book — checkout is coming soon.</p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
