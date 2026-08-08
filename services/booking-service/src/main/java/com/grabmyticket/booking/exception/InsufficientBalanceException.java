package com.grabmyticket.booking.exception;

/** Thrown when a wallet debit would take the balance below zero - the booking is rejected outright, no partial charge. */
public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}
