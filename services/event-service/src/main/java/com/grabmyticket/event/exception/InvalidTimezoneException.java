package com.grabmyticket.event.exception;

public class InvalidTimezoneException extends RuntimeException {
    public InvalidTimezoneException(String message) {
        super(message);
    }
}
