package com.grabmyticket.event.exception;

/** Thrown when an action doesn't make sense for the event's current state - e.g. publishing with no ticket types, editing a cancelled event. */
public class InvalidEventStateException extends RuntimeException {
    public InvalidEventStateException(String message) {
        super(message);
    }
}
