"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, MapPin, Ticket, ArrowLeft } from "lucide-react";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import { MockMap } from "@/components/common/mock-map";
import type { EventResponse } from "@/interfaces/event-api.interface";
import { eventService } from "@/services/event.service";
import { ApiError } from "@/lib/api-client";
import { formatEventDate, formatEventTime, formatPrice } from "@/lib/events";

interface ExploreEventDetailProps {
  slug: string;
}

/**
 * In-dashboard event detail + booking entry point for a signed-in user -
 * this is where "Book now" (from the public site or the Explore grid)
 * lands. Real ticket-tier data from event-service; the actual purchase
 * action is a placeholder until booking-service exists (see BOOKING_ENABLED).
 */
const BOOKING_ENABLED = false;

export function ExploreEventDetail({ slug }: ExploreEventDetailProps) {
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
      <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-ink-muted">
        Loading event…
      </p>
    );
  }

  if (!event) {
    return (
      <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-brand">
        Couldn&apos;t load this event. Please try again.
      </p>
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
    <div className="flex flex-col gap-5">
      <Link
        href="/user/dashboard/explore"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to Explore
      </Link>

      <div className="grid gap-5 xl:grid-cols-3">
      <div className="flex flex-col gap-5 xl:col-span-2">
        <div
          className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-cover bg-center sm:h-80"
          style={{
            background: event.bannerImageUrl
              ? `url(${event.bannerImageUrl}) center/cover`
              : `linear-gradient(160deg, ${visual?.from ?? "#242424"}, ${visual?.to ?? "#0a0a0a"})`,
          }}
        >
          <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-on-elevated">
            {event.category}
          </span>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h1 className="text-2xl font-bold text-ink">{event.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {formatEventTime(event.startAt)} – {formatEventTime(event.endAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formatEventDate(event.startAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {event.city}, {event.venueName}
            </span>
          </div>
          <p className="mt-4 whitespace-pre-line leading-7 text-ink-muted">{event.description}</p>
          <p className="mt-2 text-xs text-ink-muted">{event.address}</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-3 text-lg font-bold text-ink">Location</h2>
          <MockMap location={location} className="h-64" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-line bg-surface p-6">
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
                    <button
                      type="button"
                      disabled={soldOut || !BOOKING_ENABLED}
                      title={BOOKING_ENABLED ? undefined : "Checkout is coming soon"}
                      className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-brand-foreground disabled:cursor-not-allowed disabled:bg-ink-muted/40"
                    >
                      {soldOut ? "Sold out" : "Get ticket"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {!BOOKING_ENABLED && (
            <p className="mt-4 text-xs text-ink-muted">Checkout is coming soon — you&apos;re all set to be first in line.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
