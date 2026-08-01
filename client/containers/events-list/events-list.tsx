"use client";

import { useMemo, useState } from "react";
import { MOCK_EVENTS, EVENT_STATUS_COUNTS } from "@/constants/mock-events";
import { EventTabs } from "@/components/events/event-tabs";
import { EventFilters } from "@/components/events/event-filters";
import { EventCard } from "@/components/events/event-card";
import type { EventTab, EventTabKey, EventViewMode } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

const TABS: EventTab[] = [
  { key: "active", label: "Active", count: EVENT_STATUS_COUNTS.active },
  { key: "past", label: "Past", count: EVENT_STATUS_COUNTS.past },
  { key: "draft", label: "Draft", count: EVENT_STATUS_COUNTS.draft },
];

/** Events listing page: tab-filters by status, a toolbar with a working
 * grid/list toggle, and the responsive card grid itself. All local UI
 * state (`useState`) — nothing here needs to be server state. */
export function EventsList() {
  const [activeTab, setActiveTab] = useState<EventTabKey>("active");
  const [viewMode, setViewMode] = useState<EventViewMode>("grid");

  const visibleEvents = useMemo(
    () => MOCK_EVENTS.filter((event) => event.status === activeTab),
    [activeTab],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <EventTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        <EventFilters viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      <div
        className={cn(
          "grid gap-5",
          viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1",
        )}
      >
        {visibleEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {visibleEvents.length === 0 && (
        <p className="rounded-3xl bg-surface p-10 text-center text-sm text-ink-muted shadow-sm">
          No events in this tab yet.
        </p>
      )}
    </div>
  );
}
