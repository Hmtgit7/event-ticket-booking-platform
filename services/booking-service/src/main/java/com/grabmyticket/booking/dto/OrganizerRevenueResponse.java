package com.grabmyticket.booking.dto;

import java.math.BigDecimal;

/** Confirmed-bookings revenue only - PENDING/CANCELLED/FAILED bookings never counted. */
public record OrganizerRevenueResponse(BigDecimal totalRevenue, String currency) {
}
