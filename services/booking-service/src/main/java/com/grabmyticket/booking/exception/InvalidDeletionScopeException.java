package com.grabmyticket.booking.exception;

/** Thrown when the ?scope= query param on the internal deletion-check endpoint isn't CUSTOMER or ORGANIZER. */
public class InvalidDeletionScopeException extends RuntimeException {
    public InvalidDeletionScopeException(String message) {
        super(message);
    }
}
