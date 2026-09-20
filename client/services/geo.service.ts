import { eventApiClient } from "@/lib/api-client";
import type { CitySuggestionResponse } from "@/interfaces/geo.interface";

/** Thin wrapper over event-service's city/country reference-data endpoint. No business logic here - that lives in the hooks. */
export const geoService = {
  searchCities: (query: string, limit = 8) =>
    eventApiClient.get<CitySuggestionResponse[]>(
      `/geo/cities?q=${encodeURIComponent(query)}&limit=${limit}`,
      { skipAuth: true },
    ),
};
