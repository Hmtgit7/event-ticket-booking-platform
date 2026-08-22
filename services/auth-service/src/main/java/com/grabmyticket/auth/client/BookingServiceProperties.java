package com.grabmyticket.auth.client;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.booking-service")
public record BookingServiceProperties(String baseUrl) {
}
