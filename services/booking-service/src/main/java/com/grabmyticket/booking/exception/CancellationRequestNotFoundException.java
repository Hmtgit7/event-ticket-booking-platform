package com.grabmyticket.booking.exception;

public class CancellationRequestNotFoundException extends RuntimeException {
    public CancellationRequestNotFoundException() {
        super("Cancellation request not found");
    }
}
