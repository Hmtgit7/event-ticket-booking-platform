package com.grabmyticket.booking.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Explicit ObjectMapper bean because BookingEventPublisher needs one to hand-serialize
 * Kafka payloads (see its class comment). JavaTimeModule is registered explicitly here
 * rather than relying on findAndAddModules()'s classpath auto-discovery - that silently
 * failed to pick up Instant support even with jackson-datatype-jsr310 on the classpath,
 * which is exactly the kind of failure that should never depend on discovery magic.
 * WRITE_DATES_AS_TIMESTAMPS is off so Instant fields serialize as ISO-8601 strings,
 * matching every other service and what the client already parses.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return JsonMapper.builder()
                .addModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                .build();
    }
}
