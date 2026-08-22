import { ApiError } from "@/lib/api-client";
import type { DeletionEligibilityResponse } from "@/interfaces/account-deletion.interface";

/**
 * auth-service returns a 409 with the full DeletionEligibilityResponse body
 * (not a flat ErrorResponse) when a deletion request is blocked or has
 * unacknowledged warnings - see DeletionBlockedException on the backend.
 * This pulls that structured body back out of the caught ApiError so the
 * modal can render the same blocker/warning list a direct eligibility
 * check would have shown, instead of just a generic error message.
 */
export function getDeletionEligibilityFromError(error: unknown): DeletionEligibilityResponse | null {
  if (
    error instanceof ApiError &&
    error.status === 409 &&
    error.body &&
    typeof error.body === "object" &&
    "blockers" in error.body
  ) {
    return error.body as DeletionEligibilityResponse;
  }
  return null;
}
