package com.grabmyticket.booking.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.grabmyticket.booking.config.BookingProperties;

/**
 * Fires only AFTER_COMMIT - BookingService publishes this as a Spring
 * ApplicationEvent from inside its @Transactional method, but the actual
 * Kafka send happens strictly after the booking row is durably committed.
 * Publishing mid-transaction would risk telling notification-service about a
 * booking that then rolls back for an unrelated reason later in the method.
 */
@Component
public class BookingEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(BookingEventPublisher.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final BookingProperties bookingProperties;

    public BookingEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper, BookingProperties bookingProperties) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.bookingProperties = bookingProperties;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onBookingConfirmed(BookingConfirmedEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(bookingProperties.eventsTopic(), event.bookingId().toString(), payload);
        } catch (JsonProcessingException ex) {
            // A booking is already confirmed and paid for at this point - a failed
            // notification publish must never look like a failed booking. Log and
            // move on; the user still sees their confirmed booking either way.
            log.error("Failed to serialize booking.confirmed event for booking {}", event.bookingId(), ex);
        }
    }
}
