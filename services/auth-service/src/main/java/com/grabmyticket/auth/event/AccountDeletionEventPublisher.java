package com.grabmyticket.auth.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.grabmyticket.auth.config.AccountDeletionProperties;

/**
 * Fires only AFTER_COMMIT - same reasoning as booking-service's
 * BookingEventPublisher: AccountDeletionService publishes these as plain
 * Spring ApplicationEvents from inside its @Transactional methods, but the
 * actual Kafka send happens strictly after the row is durably committed, so
 * notification-service never hears about a deletion that then rolls back.
 *
 * Uses its own dedicated ObjectMapper rather than injecting the app-wide
 * autoconfigured one - Kafka payload serialization is a distinct concern
 * from REST responses (same reasoning behind this project's existing
 * debugging note: Instant serialization for Kafka needs JavaTimeModule
 * registered explicitly and shouldn't assume it shares config with the
 * REST-side mapper). WRITE_DATES_AS_TIMESTAMPS is disabled to match Spring
 * Boot's own default so Instant fields still come out as ISO-8601 strings.
 */
@Component
public class AccountDeletionEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(AccountDeletionEventPublisher.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    private final AccountDeletionProperties accountDeletionProperties;

    public AccountDeletionEventPublisher(
            KafkaTemplate<String, String> kafkaTemplate,
            AccountDeletionProperties accountDeletionProperties
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.accountDeletionProperties = accountDeletionProperties;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onAccountDeleted(AccountDeletedEvent event) {
        publish(event.userId().toString(), event, "user.account.deleted");
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPersonaRemoved(PersonaRemovedEvent event) {
        publish(event.userId().toString(), event, "user.persona.removed");
    }

    private void publish(String key, Object event, String eventTypeForLogging) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(accountDeletionProperties.eventsTopic(), key, payload)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            // Loud on purpose - a silently-swallowed send() here would mean
                            // a broker auth failure produces no visible signal at all while
                            // the deletion itself already committed successfully.
                            log.error("Failed to publish {} for user {}", eventTypeForLogging, key, ex);
                        } else {
                            log.info("Published {} for user {}", eventTypeForLogging, key);
                        }
                    });
        } catch (JsonProcessingException ex) {
            log.error("Failed to serialize {} for user {}", eventTypeForLogging, key, ex);
        }
    }
}
