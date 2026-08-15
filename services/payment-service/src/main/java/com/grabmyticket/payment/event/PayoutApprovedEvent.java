package com.grabmyticket.payment.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Read-side copy of booking-service's PayoutApprovedEvent - deliberately duplicated, same reasoning as every other cross-service DTO in this monorepo. */
public record PayoutApprovedEvent(
        String eventType,
        UUID payoutRequestId,
        UUID organizerId,
        BigDecimal amount,
        Instant approvedAt
) {
    public static final String TYPE = "payout.approved";
}
