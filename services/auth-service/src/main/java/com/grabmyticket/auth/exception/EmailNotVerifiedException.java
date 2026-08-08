package com.grabmyticket.auth.exception;

public class EmailNotVerifiedException extends RuntimeException {
    public EmailNotVerifiedException() {
        super("Please verify your email before logging in.");
    }

    public EmailNotVerifiedException(String message) {
        super(message);
    }
}
