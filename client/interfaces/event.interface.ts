import type { EventCategory } from "@/enums/event-category.enum";
import type { EventStatus } from "@/enums/event-status.enum";

export interface EventLocation {
  venue: string;
  city: string;
  lat: number;
  lng: number;
}

export interface DashboardEvent {
  id: string;
  title: string;
  category: EventCategory;
  status: EventStatus;
  price: number | "free";
  date: string;
  time: string;
  location: EventLocation;
  /** Percentage of tickets sold, 0-100. */
  ticketsSoldPct: number;
  description: string;
  totalTicketsBooked: number;
  attendeeRatePct: number;
}
