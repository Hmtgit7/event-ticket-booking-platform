/** Dummy data for parts of the user-facing dashboard not yet wired to real APIs. Wallet and Orders now use real data (see wallet.service.ts / booking.service.ts). */

export interface SavedEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  city: string;
  price: string | number;
  image: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  date: string;
  status: "Open" | "Resolved" | "Pending";
}

export const DUMMY_SAVED_EVENTS: SavedEvent[] = [
  { id: "fashion-empire", title: "Fashion Empire", category: "Fashion", date: "Oct 15, 2025", city: "New York", price: 40, image: "/images/event-4.jpg" },
  { id: "hip-hop-night", title: "Hip Hop Night", category: "Music", date: "Nov 20, 2025", city: "Los Angeles", price: 12, image: "/images/event-5.jpg" },
  { id: "adventure-hiking", title: "Adventure Hiking", category: "Outdoor", date: "Dec 5, 2025", city: "Denver", price: "free", image: "/images/event-6.jpg" },
];

export const DUMMY_SUPPORT_TICKETS: SupportTicket[] = [
  { id: "SUP-001", subject: "Refund request for Hip Hop Night", date: "Oct 20, 2025", status: "Open" },
  { id: "SUP-002", subject: "Unable to download ticket PDF", date: "Sep 10, 2025", status: "Resolved" },
];

export const DUMMY_NOTIFICATIONS = [
  "Food Exhibition moved check-in to Gate B.",
  "Your AI Make us Better ticket is ready for download.",
  "Adventure Hiking has 28 seats left — book now.",
];
