export type EventViewMode = "grid" | "list";

export type EventTabKey = "active" | "past" | "draft";

export interface EventTab {
  key: EventTabKey;
  label: string;
  count: number;
}

export type BarChartVariant = "capsule-line" | "solid" | "stem-dot-line";
