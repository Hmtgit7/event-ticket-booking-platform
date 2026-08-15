package com.grabmyticket.booking.exception;

public class PayoutRequestNotFoundException extends RuntimeException {
    public PayoutRequestNotFoundException() {
        super("Payout request not found");
    }
}
