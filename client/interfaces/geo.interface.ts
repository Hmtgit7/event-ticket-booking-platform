/** Mirrors event-service's CitySuggestionResponse from GET /geo/cities. */
export interface CitySuggestionResponse {
  city: string;
  countryCode: string;
  country: string;
  adminName: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
}
