package com.grabmyticket.booking.exception;

/** event-service was unreachable or returned something unexpected - a booking should fail loudly here, never silently proceed without a real seat/price check. */
public class EventServiceUnavailableException extends RuntimeException {
    public EventServiceUnavailableException(String message) {
        super(message);
    }
}
