import type { Metadata } from "next";
import { PublicEventDetail } from "@/containers/public-event-detail/public-event-detail";
import { env } from "@/lib/env";
import type { EventResponse } from "@/interfaces/event-api.interface";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Fetches directly via `fetch()` rather than `eventService` — the service
 * layer goes through `eventApiClient`, which reads the access token from
 * cookies via `js-cookie`. `js-cookie` touches `document`, which doesn't
 * exist in this server-only context, so it would throw. This endpoint is
 * public anyway (no auth needed), so a plain fetch is both correct and
 * simpler here.
 */
async function fetchEventForMetadata(slug: string): Promise<EventResponse | null> {
  try {
    const res = await fetch(`${env.eventApiUrl}/events/public/${slug}`, {
      next: { revalidate: 300 }, // 5 min — event details change rarely enough
    });
    if (!res.ok) return null;
    return (await res.json()) as EventResponse;
  } catch {
    return null;
  }
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventForMetadata(slug);

  if (!event) {
    return { title: "Event" };
  }

  const description = truncate(event.description || `${event.title} at ${event.venueName}, ${event.city}.`, 160);
  const title = event.title;
  // openGraph/twitter titles don't inherit the root layout's title.template,
  // so the brand suffix is added explicitly here for social-card display.
  const socialTitle = `${event.title} — GrabMyTicket`;

  return {
    title,
    description,
    openGraph: {
      title: socialTitle,
      description,
      type: "website",
      images: event.bannerImageUrl ? [{ url: event.bannerImageUrl }] : undefined,
    },
    twitter: {
      card: event.bannerImageUrl ? "summary_large_image" : "summary",
      title: socialTitle,
      description,
      images: event.bannerImageUrl ? [event.bannerImageUrl] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  return <PublicEventDetail slug={slug} />;
}
