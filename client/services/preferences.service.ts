import { authApiClient } from "@/lib/api-client";
import type {
  PreferenceScope,
  UpdatePreferencesPayload,
  UserPreferencesResponse,
} from "@/interfaces/preferences.interface";

/** Thin wrapper over auth-service's preferences endpoints. No business logic here - that lives in the hooks. */
export const preferencesService = {
  get: (scope: PreferenceScope = "GLOBAL") =>
    authApiClient.get<UserPreferencesResponse>(`/auth/me/preferences?scope=${scope}`),

  update: (payload: UpdatePreferencesPayload, scope: PreferenceScope = "GLOBAL") =>
    authApiClient.patch<UserPreferencesResponse>(`/auth/me/preferences?scope=${scope}`, payload),
};
