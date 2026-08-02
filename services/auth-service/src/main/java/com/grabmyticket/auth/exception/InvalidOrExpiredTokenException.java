package com.grabmyticket.auth.exception;

public class InvalidOrExpiredTokenException extends RuntimeException {
    public InvalidOrExpiredTokenException() {
        super("This verification link is invalid or has expired");
    }
}
