"use client";

import { useCallback, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import { Button, buttonVariants } from "@/components/ui/button";
import { DonutChart } from "@/components/charts/donut-chart";
import { MockMap } from "@/components/common/mock-map";
import { ProgressBar } from "@/components/common/progress-bar";
import type { EventResponse } from "@/interfaces/event-api.interface";
import { eventService } from "@/services/event.service";
import { ApiError } from "@/lib/api-client";
import { STATUS_BADGE, formatEventDate, formatEventTime, formatPrice, ticketsSoldPct } from "@/lib/events";
import { NavRoute } from "@/enums/nav-route.enum";

interface EventDetailProps {
  eventId: string;
}

const DEFAULT_VISUAL = { icon: CATEGORY_VISUAL.Music.icon, from: "#242424", to: "#0a0a0a" };

/** Single-event detail page: hero art, description, tickets-sold gauge,
 * ticket tier breakdown, location card, and lifecycle actions
 * (Publish / Cancel) wired to the real API. */
export function EventDetail({ eventId }: EventDetailProps) {
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    eventService
      .getMyEvent(eventId)
      .then(setEvent)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFoundFlag(true);
        } else {
          setActionError("Couldn't load this event. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handlePublish() {
    if (!event) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await eventService.publishEvent(event.id);
      setEvent(updated);
    } catch (err) {
      const body = err instanceof ApiError ? (err.body as { message?: string } | undefined) : undefined;
      setActionError(body?.message ?? "Couldn't publish this event.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!event) return;
    if (!confirm("Cancel this event? This can't be undone.")) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await eventService.cancelEvent(event.id);
      setEvent(updated);
    } catch (err) {
      const body = err instanceof ApiError ? (err.body as { message?: string } | undefined) : undefined;
      setActionError(body?.message ?? "Couldn't cancel this event.");
    } finally {
      setActionLoading(false);
    }
  }

  if (notFoundFlag) notFound();

  if (loading) {
    return (
      <p className="rounded-3xl bg-surface p-10 text-center text-sm text-ink-muted shadow-sm">
        Loading event…
      </p>
    );
  }

  if (!event) {
    return (
      <p className="rounded-3xl bg-surface p-10 text-center text-sm text-brand shadow-sm">
        {actionError ?? "Something went wrong."}
      </p>
    );
  }

  const visual = CATEGORY_VISUAL[event.category as EventCategory] ?? DEFAULT_VISUAL;
  const Icon = visual.icon;
  const badge = STATUS_BADGE[event.status];
  const sold = ticketsSoldPct(
    event.ticketTypes.reduce((sum, t) => sum + (t.quantityTotal - t.quantityAvailable), 0),
    event.ticketTypes.reduce((sum, t) => sum + t.quantityTotal, 0),
  );
  const location = {
    venue: event.venueName,
    city: event.city,
    lat: event.latitude ?? 0,
    lng: event.longitude ?? 0,
  };

  return (
    <div className="flex flex-col gap-5">
      <Link
        href={NavRoute.Events}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to My Events
      </Link>

      {actionError && (
        <p className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand" role="alert">
          {actionError}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-5 xl:col-span-2">
          <div
            className="relative flex h-72 items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center"
            style={{
              background: event.bannerImageUrl
                ? `url(${event.bannerImageUrl}) center/cover`
                : `linear-gradient(160deg, ${visual.from}, ${visual.to})`,
            }}
          >
            {!event.bannerImageUrl && <Icon className="size-16 text-on-elevated/60" />}
            <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-on-elevated">
              {event.category}
            </span>
            <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-on-elevated">
              <span className={`size-1.5 rounded-full ${badge.dotClass}`} />
              {badge.label}
            </span>
          </div>

          <div className="rounded-3xl bg-surface p-6 shadow-sm">
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

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <ProgressBar percent={sold} className="max-w-xs flex-1" />
              <div className="flex flex-wrap gap-2">
                {event.status === "DRAFT" && (
                  <Button onClick={handlePublish} disabled={actionLoading}>
                    {actionLoading ? "Publishing…" : "Publish event"}
                  </Button>
                )}
                {event.status !== "CANCELLED" && event.status !== "COMPLETED" && (
                  <Button variant="destructive" onClick={handleCancel} disabled={actionLoading}>
                    Cancel event
                  </Button>
                )}
                <Link href={`${NavRoute.Events}/${event.id}/insights`} className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Insights
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-ink">Ticket tiers</h2>
            <div className="flex flex-col divide-y divide-line">
              {event.ticketTypes.map((tier) => (
                <div key={tier.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{tier.name}</p>
                    <p className="text-xs text-ink-muted">
                      {tier.quantityTotal - tier.quantityAvailable} sold of {tier.quantityTotal}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-ink">{formatPrice(tier.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-3xl bg-surface p-6 text-center shadow-sm">
            <h2 className="text-left text-lg font-bold text-ink">Tickets Sold</h2>
            <p className="text-left text-xs text-ink-muted">
              {event.ticketTypes.reduce((s, t) => s + t.quantityTotal, 0).toLocaleString()} Total Capacity
            </p>
            <div className="flex justify-center py-4">
              <DonutChart
                segments={[{ label: "Sold", value: sold, color: "var(--color-ink)" }]}
                centerValue={`${sold}%`}
                centerLabel="Tickets Sold"
                size={220}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-surface p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-ink">Location</h2>
            <p className="mb-3 flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin className="size-4" />
              {event.city}, {event.venueName}
            </p>
            <MockMap location={location} />
          </div>
        </div>
      </div>
    </div>
  );
}
