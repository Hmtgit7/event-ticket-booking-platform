package com.grabmyticket.payment;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:payment_service_test;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=none",
        "spring.kafka.bootstrap-servers=localhost:19092",
        "spring.kafka.listener.auto-startup=false",
        "app.booking.events-topic=",
        "app.payment.events-topic="
})
class PaymentServiceApplicationTests {

    @Autowired
    private String bookingEventsTopic;

    @Test
    void bookingEventsTopicFallsBackToDefaultWhenPropertyIsBlank() {
        assertThat(bookingEventsTopic).isEqualTo("booking-events");
    }
}
