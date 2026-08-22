package com.grabmyticket.auth.exception;

import com.grabmyticket.auth.dto.DeletionEligibilityResponse;

/** Thrown when a deletion request (or finalization re-check) finds hard blockers, or finds unacknowledged warnings. Carries the full eligibility result so the frontend gets the same structured blocker/warning list a direct GET /auth/me/deletion-eligibility call would have returned - no separate lookup needed. */
public class DeletionBlockedException extends RuntimeException {

    private final DeletionEligibilityResponse eligibility;

    public DeletionBlockedException(DeletionEligibilityResponse eligibility) {
        super("Account deletion is blocked - see eligibility details");
        this.eligibility = eligibility;
    }

    public DeletionEligibilityResponse getEligibility() {
        return eligibility;
    }
}
