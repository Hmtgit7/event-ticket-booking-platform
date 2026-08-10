"use client";

import { useEffect, useMemo, useState } from "react";
import { EventTabs } from "@/components/events/event-tabs";
import { EventFilters } from "@/components/events/event-filters";
import { EventCard } from "@/components/events/event-card";
import { EventCardSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { NoEventsIllustration } from "@/icons/empty-state-icons";
import type { EventTab, EventTabKey, EventViewMode } from "@/types/dashboard.types";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { eventService } from "@/services/event.service";
import { deriveEventTab } from "@/lib/events";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";

/** Events listing page: tab-filters by status, a toolbar with a working
 * grid/list toggle, and the responsive card grid itself. Fetches the
 * organizer's own events once and filters client-side - fine at the
 * scale of one organizer's event list; revisit with server-side
 * pagination per tab if that stops being true. */
export function EventsList() {
  const [activeTab, setActiveTab] = useState<EventTabKey>("active");
  const [viewMode, setViewMode] = useState<EventViewMode>("grid");
  const [events, setEvents] = useState<EventSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    eventService
      .myEvents(0, 100)
      .then((page) => {
        if (!cancelled) setEvents(page.items);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? "Couldn't load your events. Please try again." : "Network error - check your connection.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tabs: EventTab[] = useMemo(() => {
    const counts = { active: 0, past: 0, draft: 0 };
    for (const event of events) counts[deriveEventTab(event.status, event.endAt)]++;
    return [
      { key: "active", label: "Active", count: counts.active },
      { key: "past", label: "Past", count: counts.past },
      { key: "draft", label: "Draft", count: counts.draft },
    ];
  }, [events]);

  const visibleEvents = useMemo(
    () => events.filter((event) => deriveEventTab(event.status, event.endAt) === activeTab),
    [events, activeTab],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <EventTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        <EventFilters viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {loading && (
        <div
          className={cn(
            "grid gap-5",
            viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1",
          )}
        >
          {Array.from({ length: viewMode === "grid" ? 8 : 4 }, (_, index) => (
            <EventCardSkeleton key={index} variant={viewMode} />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="rounded-3xl bg-surface p-10 text-center text-sm text-brand shadow-sm">{error}</p>
      )}

      {!loading && !error && (
        <div
          className={cn(
            "grid gap-5",
            viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1",
          )}
        >
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} variant={viewMode} />
          ))}
        </div>
      )}

      {!loading && !error && visibleEvents.length === 0 && (
        <EmptyState
          icon={<NoEventsIllustration className="size-28" />}
          title={activeTab === "draft" ? "No drafts yet" : `No ${activeTab} events`}
          description={
            activeTab === "draft"
              ? "Events you save without publishing will show up here."
              : activeTab === "active"
                ? "Create an event to start selling tickets."
                : "Past events will appear here once they wrap up."
          }
          action={activeTab !== "past" ? { label: "Create event", href: "/dashboard/events/create" } : undefined}
        />
      )}
    </div>
  );
}
