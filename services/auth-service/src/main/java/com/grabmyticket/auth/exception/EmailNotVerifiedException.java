package com.grabmyticket.auth.exception;

public class EmailNotVerifiedException extends RuntimeException {
    public EmailNotVerifiedException() {
        super("Please verify your email before logging in. We've sent you a new verification link.");
    }

    public EmailNotVerifiedException(String message) {
        super(message);
    }
}
