"use client";

import { useRef, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { geoService } from "@/services/geo.service";
import type { CitySuggestionResponse } from "@/interfaces/geo.interface";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

/**
 * Debounced /geo/cities lookup, same shape and request-guarding as
 * use-topbar-search.ts - state transitions happen inside setQuery (a plain
 * function called from an onChange handler), never inside a useEffect, so
 * this doesn't need any react-hooks/set-state-in-effect workaround.
 */
export function useCitySearch() {
  const [query, setQueryState] = useState("");
  const [results, setResults] = useState<CitySuggestionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  const { debounced: runSearch, cancel: cancelSearch } = useDebouncedCallback((trimmed: string) => {
    const currentRequest = requestId.current;
    geoService
      .searchCities(trimmed)
      .then((data) => {
        if (requestId.current !== currentRequest) return;
        setResults(data);
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
  }

  return { query, setQuery, results, loading, reset };
}
