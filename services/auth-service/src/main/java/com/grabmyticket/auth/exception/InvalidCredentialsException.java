package com.grabmyticket.auth.exception;

/**
 * Deliberately generic - thrown for BOTH "email not found" and "wrong password"
 * so the API response never reveals which one it was.
 */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Invalid email or password");
    }
}
