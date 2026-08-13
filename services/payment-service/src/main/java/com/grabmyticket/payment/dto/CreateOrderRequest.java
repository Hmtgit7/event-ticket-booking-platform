package com.grabmyticket.payment.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

/** Only WALLET_RECHARGE exists today, so purpose isn't a field yet - PaymentController hardcodes it. Add a purpose field here when TICKET_PURCHASE lands. */
public record CreateOrderRequest(
        @NotNull
        @DecimalMin(value = "1.00", message = "Minimum recharge amount is ₹1")
        @DecimalMax(value = "100000.00", message = "Maximum recharge amount is ₹1,00,000")
        BigDecimal amount
) {
}
