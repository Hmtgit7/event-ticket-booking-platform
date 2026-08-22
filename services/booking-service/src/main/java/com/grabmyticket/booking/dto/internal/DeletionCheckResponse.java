package com.grabmyticket.booking.dto.internal;

import java.util.List;

/**
 * Response for GET /internal/users/{userId}/deletion-check?scope=CUSTOMER|ORGANIZER.
 * eligible is true iff blockers is empty. warnings are informational-only -
 * e.g. a forfeitable wallet balance on the customer side - the caller (auth-service)
 * surfaces these to the frontend for consent UI but they never block deletion
 * by themselves. Same wire shape as event-service's copy of this contract.
 */
public record DeletionCheckResponse(boolean eligible, List<DeletionBlocker> blockers, List<DeletionBlocker> warnings) {

    public static DeletionCheckResponse of(List<DeletionBlocker> blockers, List<DeletionBlocker> warnings) {
        return new DeletionCheckResponse(blockers.isEmpty(), blockers, warnings);
    }
}
