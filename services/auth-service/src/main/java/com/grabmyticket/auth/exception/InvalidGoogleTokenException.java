package com.grabmyticket.auth.exception;

public class InvalidGoogleTokenException extends RuntimeException {
    public InvalidGoogleTokenException() {
        super("Invalid or expired Google sign-in token");
    }
}
