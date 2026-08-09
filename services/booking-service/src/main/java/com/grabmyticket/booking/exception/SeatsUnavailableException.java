package com.grabmyticket.booking.exception;

/** Not enough seats left at the moment reserveSeats() ran on event-service - a genuine race loss, not a validation error. */
public class SeatsUnavailableException extends RuntimeException {
    public SeatsUnavailableException() {
        super("Not enough seats available for this ticket type");
    }
}
