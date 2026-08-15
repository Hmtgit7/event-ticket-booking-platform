package com.grabmyticket.booking.event;

/**
 * UNUSED / DO NOT RE-ENABLE AS A SEPARATE @Component. Its logic was merged
 * into PaymentEventListener.handlePayoutExecuted() because having this as a
 * second @KafkaListener bean on the same topic + same "booking-service"
 * consumer group as PaymentEventListener would split messages between the
 * two listeners rather than delivering every message to both (they'd be
 * competing consumers within one group). Safe to delete this file manually
 * (git rm) - kept only because this MCP session has no file-delete
 * capability.
 */
final class PayoutExecutedEventListenerDeprecated {
    private PayoutExecutedEventListenerDeprecated() {
    }
}
