package com.grabmyticket.auth.dto;

import java.util.List;

import com.grabmyticket.auth.entity.DeletionScope;

/** Response for GET /auth/me/deletion-eligibility - the aggregated result of asking booking-service (and event-service, for organizer scope) whether this profile is clear to delete. */
public record DeletionEligibilityResponse(boolean eligible, DeletionScope scope, List<DeletionBlocker> blockers, List<DeletionBlocker> warnings) {

    public static DeletionEligibilityResponse of(DeletionScope scope, List<DeletionBlocker> blockers, List<DeletionBlocker> warnings) {
        return new DeletionEligibilityResponse(blockers.isEmpty(), scope, blockers, warnings);
    }
}
