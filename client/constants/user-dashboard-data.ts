/** Dummy data for the user-facing dashboard. Replace with real API calls. */

export interface OrderItem {
  id: string;
  event: string;
  date: string;
  tickets: string;
  amount: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  image: string;
}

export interface WalletTransaction {
  id: string;
  label: string;
  date: string;
  amount: string;
  type: "credit" | "debit";
  status: string;
}

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

export const DUMMY_ORDERS: OrderItem[] = [
  { id: "GMT-24018", event: "AI Make us Better", date: "Nov 6, 2025", tickets: "2 VIP", amount: "$40", status: "Confirmed", image: "/images/event-1.jpg" },
  { id: "GMT-23992", event: "Food Exhibition", date: "Nov 2, 2025", tickets: "3 General", amount: "$30", status: "Confirmed", image: "/images/event-2.jpg" },
  { id: "GMT-23845", event: "How to Camp", date: "Dec 10, 2025", tickets: "1 Workshop", amount: "$60", status: "Pending", image: "/images/event-3.jpg" },
  { id: "GMT-23701", event: "Fashion Empire", date: "Oct 15, 2025", tickets: "2 VIP", amount: "$80", status: "Confirmed", image: "/images/event-4.jpg" },
  { id: "GMT-23650", event: "Hip Hop Night", date: "Sep 28, 2025", tickets: "4 General", amount: "$48", status: "Cancelled", image: "/images/event-5.jpg" },
];

export const DUMMY_WALLET: WalletTransaction[] = [
  { id: "txn-001", label: "Refund from Fashion Empire", date: "Oct 21", amount: "+$5.00", type: "credit", status: "Completed" },
  { id: "txn-002", label: "Payment for AI Make us Better", date: "Oct 18", amount: "-$40.00", type: "debit", status: "Settled" },
  { id: "txn-003", label: "Promo credit applied", date: "Oct 12", amount: "+$12.00", type: "credit", status: "Available" },
  { id: "txn-004", label: "Payment for Food Exhibition", date: "Oct 5", amount: "-$30.00", type: "debit", status: "Settled" },
  { id: "txn-005", label: "Referral bonus", date: "Sep 30", amount: "+$10.00", type: "credit", status: "Available" },
];

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
