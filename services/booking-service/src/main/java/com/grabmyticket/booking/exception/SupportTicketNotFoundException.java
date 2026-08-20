package com.grabmyticket.booking.exception;

public class SupportTicketNotFoundException extends RuntimeException {
    public SupportTicketNotFoundException() {
        super("Support ticket not found");
    }
}
