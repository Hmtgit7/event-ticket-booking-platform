import type { AttendeeInsightData } from "@/interfaces/dashboard.interface";

/** Dummy insight data, keyed by event id — falls back to a default set. */
export const ATTENDEE_INSIGHTS: Record<string, AttendeeInsightData> = {
  default: {
    totalAttendees: 19000,
    genderSplit: [
      { label: "Male", value: 75, color: "var(--color-surface)" },
      { label: "Female", value: 25, color: "var(--color-ink)" },
    ],
    ageBreakdown: [
      { label: "18-23", value: 30, color: "var(--color-ink-muted)" },
      { label: "Below 18", value: 20, color: "var(--color-ink)" },
      { label: "24-30", value: 25, color: "var(--color-surface)" },
      { label: "31-35", value: 15, color: "var(--color-line)" },
      { label: "Above 35", value: 10, color: "var(--color-surface-hover)" },
    ],
    topLocations: [
      { label: "Colombo", value: 2500 }, { label: "Kandy", value: 2200 },
      { label: "Badulla", value: 2000 }, { label: "Nuwara Eliya", value: 1500 },
      { label: "Maharagama", value: 1200 }, { label: "Dehiwala", value: 950 },
      { label: "Gampaha", value: 800 },
    ],
    topCategories: [
      { label: "Outdoor & Adventure", value: 90 }, { label: "Music", value: 78 },
      { label: "Health & Fitness", value: 55 }, { label: "Fashion", value: 82 },
      { label: "Food & Culinary", value: 70 },
    ],
  },
};

export function getAttendeeInsight(eventId: string): AttendeeInsightData {
  return ATTENDEE_INSIGHTS[eventId] ?? ATTENDEE_INSIGHTS.default;
}
