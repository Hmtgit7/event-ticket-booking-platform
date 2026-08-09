package com.grabmyticket.booking.exception;

public class TicketTypeNotFoundException extends RuntimeException {
    public TicketTypeNotFoundException() {
        super("Ticket type not found");
    }
}
