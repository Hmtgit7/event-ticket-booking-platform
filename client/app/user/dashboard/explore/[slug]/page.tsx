import type { Metadata } from "next";
import { ExploreEventDetail } from "@/containers/user-dashboard/explore-detail/explore-event-detail";

interface ExploreEventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ExploreEventPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} | GrabMyTicket` };
}

export default async function ExploreEventPage({ params }: ExploreEventPageProps) {
  const { slug } = await params;
  return <ExploreEventDetail slug={slug} />;
}
