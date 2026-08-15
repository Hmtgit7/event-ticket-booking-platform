package com.grabmyticket.booking.dto;

import java.math.BigDecimal;

/** grossRevenue = all-time confirmed-booking revenue. platformCommission is what GrabMyTicket keeps. availableBalance = what's left minus anything already requested/approved/paid - the true withdrawable amount. */
public record AvailableBalanceResponse(
        BigDecimal grossRevenue,
        BigDecimal platformCommissionRate,
        BigDecimal availableBalance,
        String currency
) {
}
