"use client";

import { useRef, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { eventService } from "@/services/event.service";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;
const MAX_RESULTS = 6;

/**
 * Search state backing the topbar search bar. Matches against event title,
 * description, venue, and city (see event-service's keywordContains) so
 * typing a city name surfaces results just like typing an event name
 * would. Debouncing itself lives in the reusable useDebouncedCallback hook
 * - this hook only owns the search-specific state and guards against a
 * slow, superseded request overwriting a newer one.
 */
export function useTopbarSearch() {
  const [query, setQueryState] = useState("");
  const [results, setResults] = useState<EventSummaryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const requestId = useRef(0);

  const { debounced: runSearch, cancel: cancelSearch } = useDebouncedCallback((trimmed: string) => {
    const currentRequest = requestId.current;
    eventService
      .publicEvents({ search: trimmed, size: MAX_RESULTS })
      .then((result) => {
        if (requestId.current !== currentRequest) return;
        setResults(result.items);
      })
      .catch(() => {
        if (requestId.current !== currentRequest) return;
        setResults([]);
      })
      .finally(() => {
        if (requestId.current !== currentRequest) return;
        setLoading(false);
      });
  }, DEBOUNCE_MS);

  function setQuery(value: string) {
    setQueryState(value);
    cancelSearch();
    requestId.current += 1;

    const trimmed = value.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    runSearch(trimmed);
  }

  function reset() {
    cancelSearch();
    requestId.current += 1;
    setQueryState("");
    setResults([]);
    setLoading(false);
    setOpen(false);
  }

  return { query, setQuery, results, loading, open, setOpen, reset };
}
