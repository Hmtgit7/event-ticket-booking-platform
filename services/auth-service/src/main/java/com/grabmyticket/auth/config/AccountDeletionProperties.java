package com.grabmyticket.auth.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** gracePeriod - how long a PENDING_DELETION account can still cancel before AccountDeletionReaper finalizes it. 14 days matches the industry-standard cooldown (Google/LinkedIn/Instagram-style) discussed in the Phase 9 plan. */
@ConfigurationProperties(prefix = "app.account-deletion")
public record AccountDeletionProperties(Duration gracePeriod) {
}
