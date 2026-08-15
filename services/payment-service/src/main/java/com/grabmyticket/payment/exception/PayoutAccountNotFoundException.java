package com.grabmyticket.payment.exception;

public class PayoutAccountNotFoundException extends RuntimeException {
    public PayoutAccountNotFoundException() {
        super("No payout account on file yet");
    }
}
