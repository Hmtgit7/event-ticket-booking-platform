package com.grabmyticket.event.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TicketTypeResponse(
        UUID id,
        String name,
        BigDecimal price,
        Integer quantityTotal,
        Integer quantityAvailable,
        Instant salesStart,
        Instant salesEnd
) {
}
