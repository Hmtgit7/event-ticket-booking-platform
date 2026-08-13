package com.grabmyticket.payment.dto;

import java.math.BigDecimal;

/** Everything the client's Razorpay Checkout widget needs to open - keyId is public by design (it's the publishable key, keySecret never leaves this service). */
public record CreateOrderResponse(
        String razorpayOrderId,
        BigDecimal amount,
        String currency,
        String razorpayKeyId
) {
}
