package com.grabmyticket.booking.exception;

/** Payout can't be reviewed twice - already APPROVED/REJECTED/PAID/FAILED is a terminal state. */
public class PayoutRequestNotReviewableException extends RuntimeException {
    public PayoutRequestNotReviewableException(String message) {
        super(message);
    }
}
