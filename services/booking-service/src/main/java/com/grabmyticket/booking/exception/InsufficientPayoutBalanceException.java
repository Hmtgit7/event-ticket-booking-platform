package com.grabmyticket.booking.exception;

public class InsufficientPayoutBalanceException extends RuntimeException {
    public InsufficientPayoutBalanceException(String message) {
        super(message);
    }
}
