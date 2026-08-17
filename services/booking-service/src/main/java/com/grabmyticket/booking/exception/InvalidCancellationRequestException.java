package com.grabmyticket.booking.exception;

public class InvalidCancellationRequestException extends RuntimeException {
    public InvalidCancellationRequestException(String message) {
        super(message);
    }
}
