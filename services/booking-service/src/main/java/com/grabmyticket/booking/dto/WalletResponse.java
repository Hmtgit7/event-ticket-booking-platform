package com.grabmyticket.booking.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record WalletResponse(
        UUID id,
        BigDecimal balance,
        String currency,
        Instant updatedAt
) {
}
