import { CalendarRange, Ticket, CalendarClock } from "lucide-react";
import type { StatCardData, TicketSummary } from "@/interfaces/dashboard.interface";
import type { ChartPoint } from "@/interfaces/chart.interface";

export const DASHBOARD_STATS: StatCardData[] = [
  { id: "total-events", label: "Total Events", value: "21", icon: CalendarRange, deltaPct: -5, comparedTo: "vs Last month" },
  { id: "tickets-sold", label: "Tickets Sold", value: "94", icon: Ticket, deltaPct: 9, comparedTo: "vs Last month" },
  { id: "upcoming-events", label: "Upcoming Events", value: "19", icon: CalendarClock, deltaPct: -7, comparedTo: "vs Last month" },
];

export const REVENUE_BREAKDOWN: ChartPoint[] = [
  { label: "Jan", value: 92 }, { label: "Feb", value: 168 }, { label: "Mar", value: 140 },
  { label: "Apr", value: 132 }, { label: "May", value: 78 }, { label: "Jun", value: 90 },
  { label: "Jul", value: 104 }, { label: "Aug", value: 156 }, { label: "Sep", value: 118 },
  { label: "Oct", value: 128 }, { label: "Nov", value: 82 }, { label: "Dec", value: 110 },
];

export const TICKET_SUMMARY: TicketSummary = {
  segments: [
    { label: "General", value: 50, color: "var(--color-ink)" },
    { label: "VIP", value: 30, color: "var(--color-ink-muted)" },
    { label: "Students", value: 20, color: "var(--color-surface)" },
  ],
  totalTicketsSold: 1800,
  totalRevenue: "$5,480",
  conversionRatePct: 10,
};
