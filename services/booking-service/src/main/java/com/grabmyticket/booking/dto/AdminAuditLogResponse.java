package com.grabmyticket.booking.dto;

import java.time.Instant;
import java.util.UUID;

public record AdminAuditLogResponse(
        UUID id,
        UUID actorId,
        String action,
        String targetType,
        UUID targetId,
        String reason,
        Instant createdAt
) {
}
