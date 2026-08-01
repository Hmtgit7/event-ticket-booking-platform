export const EventStatus = {
  Active: "active",
  Past: "past",
  Draft: "draft",
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  [EventStatus.Active]: "Active",
  [EventStatus.Past]: "Past",
  [EventStatus.Draft]: "Draft",
};
