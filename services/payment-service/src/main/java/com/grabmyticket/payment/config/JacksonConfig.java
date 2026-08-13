package com.grabmyticket.payment.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Explicit ObjectMapper bean, same reasoning as booking-service's
 * JacksonConfig: PaymentEventPublisher needs one to hand-serialize the
 * payment.completed Kafka payload (see its class comment), and nothing in
 * this service's dependency set auto-configures one on its own -
 * spring-boot-starter-webmvc alone isn't enough here. JavaTimeModule is
 * registered explicitly rather than relying on classpath auto-discovery,
 * which is the same failure mode booking-service already hit once.
 * WRITE_DATES_AS_TIMESTAMPS is off so Instant fields serialize as ISO-8601
 * strings, matching every other service.
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
