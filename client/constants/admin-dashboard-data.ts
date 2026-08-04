/**
 * Dummy data for the super-admin dashboard.
 * Replace with real API calls when the backend is ready.
 */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "organizer";
  status: "Active" | "Suspended" | "Pending";
  joined: string;
  bookings: number;
}

export interface AdminEvent {
  id: string;
  title: string;
  organizer: string;
  category: string;
  date: string;
  status: "Live" | "Draft" | "Flagged" | "Ended";
  ticketsSold: number;
  revenue: string;
}

export interface AdminBooking {
  id: string;
  user: string;
  event: string;
  date: string;
  tickets: string;
  amount: string;
  status: "Confirmed" | "Pending" | "Refunded" | "Cancelled";
}

export interface AdminSupportTicket {
  id: string;
  user: string;
  subject: string;
  category: "Refund" | "Technical" | "Event Issue" | "Other";
  created: string;
  status: "Open" | "In Progress" | "Resolved";
  priority: "High" | "Medium" | "Low";
}

export interface AdminPlatformStat {
  id: string;
  label: string;
  value: string;
  deltaPct: number;
  comparedTo: string;
}

// ── Platform stats ──────────────────────────────────────────────────────────
export const ADMIN_PLATFORM_STATS: AdminPlatformStat[] = [
  { id: "total-users",    label: "Total Users",      value: "12,480", deltaPct: 14,  comparedTo: "vs last month" },
  { id: "total-events",   label: "Active Events",    value: "348",    deltaPct: 8,   comparedTo: "vs last month" },
  { id: "total-bookings", label: "Bookings Today",   value: "1,092",  deltaPct: -3,  comparedTo: "vs yesterday"  },
  { id: "gross-revenue",  label: "Gross Revenue",    value: "$94.2k", deltaPct: 21,  comparedTo: "vs last month" },
  { id: "open-tickets",   label: "Open Tickets",     value: "37",     deltaPct: -12, comparedTo: "vs last week"  },
  { id: "flagged-events", label: "Flagged Events",   value: "5",      deltaPct: 0,   comparedTo: "no change"     },
];

// ── Users ────────────────────────────────────────────────────────────────────
export const ADMIN_USERS: AdminUser[] = [
  { id: "u-001", name: "Alice Sharma",    email: "alice@example.com",   role: "user",      status: "Active",    joined: "Jan 12, 2025",  bookings: 14 },
  { id: "u-002", name: "Bob Fernandez",   email: "bob@example.com",     role: "organizer", status: "Active",    joined: "Mar 3, 2025",   bookings: 2  },
  { id: "u-003", name: "Carol Nguyen",    email: "carol@example.com",   role: "user",      status: "Suspended", joined: "Feb 18, 2025",  bookings: 7  },
  { id: "u-004", name: "David Osei",      email: "david@example.com",   role: "organizer", status: "Active",    joined: "Apr 22, 2025",  bookings: 5  },
  { id: "u-005", name: "Elena Petrov",    email: "elena@example.com",   role: "user",      status: "Pending",   joined: "Jun 30, 2025",  bookings: 0  },
  { id: "u-006", name: "Frank Muller",    email: "frank@example.com",   role: "user",      status: "Active",    joined: "Jul 8, 2025",   bookings: 22 },
  { id: "u-007", name: "Grace Kim",       email: "grace@example.com",   role: "organizer", status: "Active",    joined: "Aug 1, 2025",   bookings: 3  },
];

// ── Events ───────────────────────────────────────────────────────────────────
export const ADMIN_EVENTS: AdminEvent[] = [
  { id: "food-exhibition",  title: "Food Exhibition",   organizer: "Bob Fernandez", category: "Food",       date: "Nov 2, 2025",  status: "Live",    ticketsSold: 5340, revenue: "$53,400" },
  { id: "ai-make-us-better",title: "AI Make us Better", organizer: "David Osei",   category: "Technology", date: "Nov 6, 2025",  status: "Live",    ticketsSold: 4120, revenue: "$82,400" },
  { id: "fashion-empire",   title: "Fashion Empire",    organizer: "Grace Kim",    category: "Fashion",    date: "Nov 27, 2025", status: "Live",    ticketsSold: 2870, revenue: "$14,350" },
  { id: "how-to-camp",      title: "How to Camp",       organizer: "David Osei",   category: "Outdoor",    date: "Dec 10, 2025", status: "Flagged", ticketsSold: 1980, revenue: "$118,800"},
  { id: "hip-hop-thugs",    title: "Hip Hop Thugs",     organizer: "Bob Fernandez",category: "Music",      date: "Dec 31, 2025", status: "Live",    ticketsSold: 6110, revenue: "$549,900"},
  { id: "balanced-diet",    title: "Balanced Diet",     organizer: "Grace Kim",    category: "Health",     date: "Jan 6, 2026",  status: "Draft",   ticketsSold: 940,  revenue: "$5,640"  },
  { id: "code-with-us",     title: "Code with Us",      organizer: "David Osei",   category: "Technology", date: "Jan 30, 2026", status: "Live",    ticketsSold: 3300, revenue: "$0"      },
];

// ── Bookings ─────────────────────────────────────────────────────────────────
export const ADMIN_BOOKINGS: AdminBooking[] = [
  { id: "BK-9901", user: "Alice Sharma",  event: "AI Make us Better", date: "Oct 28, 2025", tickets: "2 VIP",     amount: "$40",  status: "Confirmed" },
  { id: "BK-9902", user: "Frank Muller",  event: "Food Exhibition",   date: "Oct 29, 2025", tickets: "3 General", amount: "$30",  status: "Confirmed" },
  { id: "BK-9903", user: "Carol Nguyen",  event: "Fashion Empire",    date: "Oct 30, 2025", tickets: "1 VIP",     amount: "$5",   status: "Refunded"  },
  { id: "BK-9904", user: "Elena Petrov",  event: "How to Camp",       date: "Oct 31, 2025", tickets: "1 Workshop",amount: "$60",  status: "Pending"   },
  { id: "BK-9905", user: "Alice Sharma",  event: "Hip Hop Thugs",     date: "Nov 1, 2025",  tickets: "2 General", amount: "$180", status: "Confirmed" },
  { id: "BK-9906", user: "Frank Muller",  event: "Code with Us",      date: "Nov 2, 2025",  tickets: "1 General", amount: "$0",   status: "Confirmed" },
  { id: "BK-9907", user: "Grace Kim",     event: "Balanced Diet",     date: "Nov 3, 2025",  tickets: "2 General", amount: "$12",  status: "Cancelled" },
];

// ── Support Tickets ───────────────────────────────────────────────────────────
export const ADMIN_SUPPORT: AdminSupportTicket[] = [
  { id: "SUP-101", user: "Carol Nguyen",  subject: "Refund not processed after 7 days",       category: "Refund",      created: "Oct 20, 2025", status: "Open",        priority: "High"   },
  { id: "SUP-102", user: "Elena Petrov",  subject: "Cannot download ticket PDF",              category: "Technical",   created: "Oct 22, 2025", status: "In Progress", priority: "Medium" },
  { id: "SUP-103", user: "Frank Muller",  subject: "Event description is incorrect",          category: "Event Issue", created: "Oct 25, 2025", status: "Open",        priority: "High"   },
  { id: "SUP-104", user: "Alice Sharma",  subject: "Duplicate charge on card",                category: "Refund",      created: "Oct 27, 2025", status: "In Progress", priority: "High"   },
  { id: "SUP-105", user: "David Osei",    subject: "Cannot publish event — stuck on draft",   category: "Technical",   created: "Oct 28, 2025", status: "Open",        priority: "Medium" },
  { id: "SUP-106", user: "Grace Kim",     subject: "Wrong venue shown on booking confirmation",category: "Event Issue",created: "Oct 29, 2025", status: "Resolved",    priority: "Low"    },
];

// ── Revenue chart (monthly) ───────────────────────────────────────────────────
export const ADMIN_REVENUE_CHART = [
  { label: "Jan", value: 42 }, { label: "Feb", value: 68 }, { label: "Mar", value: 55 },
  { label: "Apr", value: 73 }, { label: "May", value: 90 }, { label: "Jun", value: 61 },
  { label: "Jul", value: 84 }, { label: "Aug", value: 110 },{ label: "Sep", value: 95 },
  { label: "Oct", value: 128 },{ label: "Nov", value: 104 },{ label: "Dec", value: 94 },
];
