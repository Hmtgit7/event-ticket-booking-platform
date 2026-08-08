package com.grabmyticket.event.exception;

/** Thrown when a reserve call can't get the requested quantity - not enough seats left at the moment the UPDATE ran. */
public class InsufficientSeatsException extends RuntimeException {
    public InsufficientSeatsException() {
        super("Not enough seats available for this ticket type");
    }
}
