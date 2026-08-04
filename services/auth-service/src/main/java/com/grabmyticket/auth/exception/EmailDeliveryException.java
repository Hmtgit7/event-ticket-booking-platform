package com.grabmyticket.auth.exception;

/** Brevo (or whatever email provider) rejected the send or was unreachable. */
public class EmailDeliveryException extends RuntimeException {
    public EmailDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}
