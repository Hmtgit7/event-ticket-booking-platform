package com.grabmyticket.booking.exception;

/** The event/ticket type exists but can't be booked right now - unpublished, sales window closed, or cancelled. */
public class EventNotBookableException extends RuntimeException {
    public EventNotBookableException(String message) {
        super(message);
    }
}
