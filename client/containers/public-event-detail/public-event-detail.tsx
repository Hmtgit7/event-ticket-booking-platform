"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Ticket, ArrowLeft } from "lucide-react";
import { CATEGORY_VISUAL, type EventCategory } from "@/enums/event-category.enum";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { MockMap } from "@/components/common/mock-map";
import { EventDetailSkeleton } from "@/components/skeleton";
import type { EventResponse, EventSummaryResponse } from "@/interfaces/event-api.interface";
import { eventService } from "@/services/event.service";
import { ApiError } from "@/lib/api-client";
import { formatEventDateRange, formatPrice } from "@/lib/events";
import { useTranslations } from "@/hooks/use-translations";
import { useAuthStore } from "@/store/auth-store";
import { BookNowAction } from "@/components/public-events/book-now-action";
import { EventHeroActions } from "@/components/public-events/event-hero-actions";
import { EventAboutCard } from "@/components/public-events/event-about-card";

interface PublicEventDetailProps {
  slug: string;
}

export function PublicEventDetail({ slug }: PublicEventDetailProps) {
  const t = useTranslations("browse");
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const currentUser = useAuthStore((state) => state.user);
  const isSignedIn = currentUser !== null;

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
        <EventDetailSkeleton />
      </MarketingLayout>
    );
  }

  if (!event) {
    return (
      <MarketingLayout>
        <div className="mx-auto max-w-4xl px-4 py-24 text-center text-sm text-brand">
          {t("detailLoadError")}
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
  // EventHeroActions (share/save) takes the lighter EventSummaryResponse shape - same
  // shape the Saved Events store persists, so a save here round-trips cleanly there.
  const eventSummary: EventSummaryResponse = {
    id: event.id,
    title: event.title,
    slug: event.slug,
    category: event.category,
    venueName: event.venueName,
    city: event.city,
    timezone: event.timezone,
    startAt: event.startAt,
    endAt: event.endAt,
    bannerImageUrl: event.bannerImageUrl,
    status: event.status,
    fromPrice: event.ticketTypes.length ? Math.min(...event.ticketTypes.map((tier) => tier.price)) : null,
    totalCapacity: event.ticketTypes.reduce((sum, tier) => sum + tier.quantityTotal, 0),
    totalSold: event.ticketTypes.reduce((sum, tier) => sum + (tier.quantityTotal - tier.quantityAvailable), 0),
  };
  // Route to the viewer's own event-management page if they're the organizer of *this*
  // event; everyone else (including organizers viewing someone else's event) goes through
  // BookNowAction, which itself decides whether a persona-switch confirm is needed.
  const isOwner = isSignedIn && currentUser?.id === event.organizerId;
  const eventPath = `/user/dashboard/explore/${event.slug}`;
  const ctaLabel = isOwner ? t("manageEvent") : t("getTicket");

  return (
    <MarketingLayout>
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link href="/events" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-ink">
          <ArrowLeft className="size-4" />
          {t("backToEvents")}
        </Link>
      </section>

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
          <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
            <div className="rounded-xl bg-black/55 px-3 py-1.5 text-xs font-bold text-on-elevated backdrop-blur">
              {event.category}
            </div>
            <EventHeroActions event={eventSummary} />
          </div>
          <div className="absolute bottom-6 left-5 right-5 text-on-elevated sm:left-8 sm:right-8">
            <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">{event.title}</h1>
            <p className="mt-2 text-sm font-medium text-on-elevated/85 sm:text-base">
              {formatEventDateRange(event.startAt, event.endAt, event.timezone)}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div className="flex flex-col gap-8">
          <EventAboutCard event={event} />

          <div className="rounded-[24px] border border-line bg-canvas p-6 shadow-sm dark:bg-[#211b14]">
            <h2 className="mb-3 text-lg font-bold text-ink">{t("location")}</h2>
            <MockMap location={location} className="h-64" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[24px] border border-line bg-canvas p-6 shadow-sm dark:bg-[#211b14]">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
              <Ticket className="size-5 text-brand" /> {t("tickets")}
            </h2>
            <div className="flex flex-col divide-y divide-line">
              {event.ticketTypes.map((tier) => {
                const seatsLeft = tier.quantityAvailable;
                const soldOut = seatsLeft <= 0 && !isOwner;
                return (
                  <div key={tier.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{tier.name}</p>
                      <p className="text-xs text-ink-muted">{seatsLeft <= 0 ? t("soldOut") : `${seatsLeft} ${t("seatsLeft")}`}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-ink">{formatPrice(tier.price)}</span>
                      {soldOut ? (
                        <span className="pointer-events-none rounded-xl bg-ink-muted/40 px-4 py-2 text-sm font-bold text-brand-foreground">
                          {t("soldOut")}
                        </span>
                      ) : isOwner ? (
                        <Link
                          href={`/dashboard/events/${event.id}`}
                          className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-brand-foreground"
                        >
                          {ctaLabel}
                        </Link>
                      ) : (
                        <BookNowAction
                          eventPath={eventPath}
                          className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-brand-foreground"
                        >
                          {ctaLabel}
                        </BookNowAction>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-ink-muted">
              {isOwner
                ? t("ownerNotice")
                : isSignedIn
                  ? t("signedInNotice")
                  : t("signedOutNotice")}
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
