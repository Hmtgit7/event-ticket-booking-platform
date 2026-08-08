package com.grabmyticket.booking.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

/** "Payment integration coming soon" dummy recharge - just credits the entered amount. No min/max by design for now. */
public record RechargeWalletRequest(
        @NotNull @DecimalMin(value = "0.01", message = "amount must be greater than 0") BigDecimal amount
) {
}
