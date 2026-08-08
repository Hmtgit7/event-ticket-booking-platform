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

/**
 * True when the API rejected the request specifically because the account's
 * email isn't verified yet (auth-service's EmailNotVerifiedException, code
 * "EMAIL_NOT_VERIFIED"). Checked by code, not by matching on `message` text,
 * since message copy can change independently of the error semantics.
 */
export function isEmailNotVerifiedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    const body = error.body as Partial<ApiErrorResponse> | undefined;
    return body?.code === "EMAIL_NOT_VERIFIED";
  }
  return false;
}
