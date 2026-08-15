package com.grabmyticket.booking.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record CreatePayoutRequestRequest(
        @NotNull
        @DecimalMin(value = "1.00", message = "Minimum payout amount is ₹1")
        BigDecimal amount
) {
}
