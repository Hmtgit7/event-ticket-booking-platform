/** Mirrors auth-service's PreferenceScope enum. */
export type PreferenceScope = "GLOBAL" | "CUSTOMER" | "ORGANIZER";

/** Mirrors auth-service's UserPreferencesResponse - fully resolved, never null language/timezone (falls back to platform default: en/UTC). country can be null. */
export interface UserPreferencesResponse {
  scope: PreferenceScope;
  language: string;
  languageInherited: boolean;
  timezone: string;
  timezoneInherited: boolean;
  country: string | null;
  countryInherited: boolean;
}

/** Mirrors auth-service's UpdatePreferencesRequest - all fields optional, omitted = leave unchanged. */
export interface UpdatePreferencesPayload {
  language?: string;
  timezone?: string;
  country?: string;
}
