package com.grabmyticket.auth.exception;

public class AdminBootstrapException extends RuntimeException {
    public AdminBootstrapException() {
        super("Invalid bootstrap request");
    }
}
