package com.grabmyticket.payment.exception;

public class PayoutAccountAlreadyActiveException extends RuntimeException {
    public PayoutAccountAlreadyActiveException(String message) {
        super(message);
    }
}
