package com.grabmyticket.booking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.booking")
public record BookingProperties(String holdTtl, String eventsTopic) {
}
