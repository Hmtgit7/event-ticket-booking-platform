package com.grabmyticket.auth.dto.internal;

import java.util.List;

import com.grabmyticket.auth.dto.DeletionBlocker;

/** Deserialization target for booking-service's and event-service's GET .../deletion/check responses - both return this exact shape by convention. */
public record DeletionCheckResponse(boolean eligible, List<DeletionBlocker> blockers, List<DeletionBlocker> warnings) {
}
