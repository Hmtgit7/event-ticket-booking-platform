import type { LucideIcon } from "lucide-react";
import type { ChartPoint, DonutSegment } from "@/interfaces/chart.interface";

export interface StatCardData {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  deltaPct: number;
  comparedTo: string;
}

export interface TicketSummary {
  segments: DonutSegment[];
  totalTicketsSold: number;
  totalRevenue: string;
  conversionRatePct: number;
}

export interface AttendeeInsightData {
  totalAttendees: number;
  genderSplit: DonutSegment[];
  ageBreakdown: DonutSegment[];
  topLocations: ChartPoint[];
  topCategories: ChartPoint[];
}
