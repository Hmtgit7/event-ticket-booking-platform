import type { Metadata } from "next";
import { ExploreEventDetail } from "@/containers/user-dashboard/explore-detail/explore-event-detail";

interface ExploreEventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ExploreEventPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Private, noindex page (see layout.tsx) - no real fetch here, just a
  // readable tab title from the slug. `EventDetailSkeleton`/`ExploreEventDetail`
  // itself shows the real title once loaded.
  const readable = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: readable };
}

export default async function ExploreEventPage({ params }: ExploreEventPageProps) {
  const { slug } = await params;
  return <ExploreEventDetail slug={slug} />;
}
