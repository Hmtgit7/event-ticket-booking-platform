package com.grabmyticket.auth.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** gracePeriod - how long a PENDING_DELETION account can still cancel before AccountDeletionReaper finalizes it. 14 days matches the industry-standard cooldown (Google/LinkedIn/Instagram-style) discussed in the Phase 9 plan. eventsTopic - where AccountDeletionEventPublisher sends user.account.deleted / user.persona.removed for notification-service to consume. requestCooldown - minimum time between deletion-request attempts for the same user, enforced by DeletionRequestRateLimiter - see that class for why this is in-memory rather than DB-backed. */
@ConfigurationProperties(prefix = "app.account-deletion")
public record AccountDeletionProperties(Duration gracePeriod, String eventsTopic, Duration requestCooldown) {
}
