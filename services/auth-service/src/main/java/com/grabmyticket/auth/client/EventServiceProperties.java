package com.grabmyticket.auth.client;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.event-service")
public record EventServiceProperties(String baseUrl) {
}
