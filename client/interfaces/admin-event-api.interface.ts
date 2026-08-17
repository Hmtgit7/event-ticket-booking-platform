/**
 * Shapes for event-service's /admin/events endpoints. Field names match
 * EventSummaryResponse.java exactly. status includes the two admin-only
 * moderation states (FLAGGED, REMOVED) alongside the organizer-lifecycle
 * ones (DRAFT/PUBLISHED/CANCELLED/COMPLETED).
 */

export type AdminEventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED" | "FLAGGED" | "REMOVED";

export interface AdminEventSummary {
  id: string;
  organizerId: string;
  title: string;
  slug: string;
  category: string;
  venueName: string;
  city: string;
  startAt: string;
  endAt: string;
  bannerImageUrl: string | null;
  status: AdminEventStatus;
  fromPrice: number | null;
  totalCapacity: number;
  totalSold: number;
  moderationReason: string | null;
}
