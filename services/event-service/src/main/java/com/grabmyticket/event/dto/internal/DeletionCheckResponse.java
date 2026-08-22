package com.grabmyticket.event.dto.internal;

import java.util.List;

/**
 * Response for GET /internal/organizers/{organizerId}/deletion/check.
 * eligible is true iff blockers is empty - blockers are hard stops, warnings
 * are informational-only items the caller may still want to surface (e.g. a
 * forfeitable wallet balance in booking-service's version of this contract).
 * event-service currently never produces warnings (every finding here is a
 * hard block), but the field is kept so the wire shape is identical across
 * every service that implements this contract (see booking-service's copy).
 */
public record DeletionCheckResponse(boolean eligible, List<DeletionBlocker> blockers, List<DeletionBlocker> warnings) {

    public static DeletionCheckResponse noBlockers() {
        return new DeletionCheckResponse(true, List.of(), List.of());
    }

    public static DeletionCheckResponse blockedBy(List<DeletionBlocker> blockers) {
        return new DeletionCheckResponse(blockers.isEmpty(), blockers, List.of());
    }
}
