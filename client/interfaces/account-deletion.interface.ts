/** Mirrors auth-service's DeletionScope enum. */
export type DeletionScope = "CUSTOMER" | "ORGANIZER" | "FULL_ACCOUNT";

/** Mirrors auth-service's DeletionStatus enum. */
export type DeletionStatus = "ACTIVE" | "PENDING_DELETION" | "DELETED";

/** Mirrors auth-service's DeletionBlocker record - identical shape reused by booking-service/event-service's internal contracts too. code is stable/machine-readable, message is what to show the user. */
export interface DeletionBlocker {
  code: string;
  message: string;
  count: number;
}

/** Response for GET /auth/me/deletion-eligibility, and the 409 body auth-service returns from POST /auth/me/deletion-request when blocked or warnings are unacknowledged. */
export interface DeletionEligibilityResponse {
  eligible: boolean;
  scope: DeletionScope;
  blockers: DeletionBlocker[];
  warnings: DeletionBlocker[];
}

/** currentPassword omitted for Google-only accounts, same convention as ChangePasswordPayload. acknowledgeWarnings must be true if the eligibility check returned any warnings (e.g. a forfeitable wallet balance). */
export interface RequestAccountDeletionPayload {
  scope: DeletionScope;
  currentPassword?: string;
  acknowledgeWarnings: boolean;
}

/** Mirrors auth-service's AccountDeletionStatusResponse - powers the app-wide pending-deletion banner. */
export interface AccountDeletionStatusResponse {
  status: DeletionStatus;
  scope: DeletionScope | null;
  requestedAt: string | null;
  scheduledFor: string | null;
}
