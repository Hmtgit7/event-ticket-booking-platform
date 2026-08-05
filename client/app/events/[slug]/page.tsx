import type { Metadata } from "next";
import { PublicEventDetail } from "@/containers/public-event-detail/public-event-detail";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} | GrabMyTicket` };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  return <PublicEventDetail slug={slug} />;
}
