import { ApiError } from "@/lib/api-client";
import type { ApiErrorResponse } from "@/interfaces/auth.interface";

/** Extracts auth-service's ErrorResponse.message, with a safe fallback for network/unknown errors. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) {
    const body = error.body as Partial<ApiErrorResponse> | undefined;
    if (body?.message) {
      return body.message;
    }
  }
  return fallback;
}
