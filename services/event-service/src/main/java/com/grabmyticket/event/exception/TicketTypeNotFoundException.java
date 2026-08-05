package com.grabmyticket.event.exception;

public class TicketTypeNotFoundException extends RuntimeException {
    public TicketTypeNotFoundException() {
        super("Ticket type not found");
    }
}
