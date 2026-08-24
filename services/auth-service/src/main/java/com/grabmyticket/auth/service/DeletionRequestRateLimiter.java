package com.grabmyticket.auth.service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.grabmyticket.auth.config.AccountDeletionProperties;
import com.grabmyticket.auth.exception.TooManyRequestsException;

/**
 * Throttles POST /auth/me/deletion-request to one attempt per
 * requestCooldown per user (default 60s, see AccountDeletionProperties).
 *
 * Deliberately in-memory (ConcurrentHashMap), not DB-backed like
 * VerificationTokenService's resend cooldown - a deletion request isn't
 * repeatable in the way a resend-email click is (DeletionAlreadyRequestedException
 * already blocks a second real request outright once one is PENDING_DELETION),
 * so the only thing this actually needs to catch is someone hammering retry
 * after a failed/blocked attempt (a stale password, a blocker that hasn't
 * cleared yet). That's an abuse-prevention concern, not a security boundary
 * - the security-critical checks (re-auth, role/scope validation, admin
 * exclusion, blocker re-check) all happen regardless of this limiter, so
 * losing this state on a restart is an acceptable trade for not needing a
 * migration or an extra DB round trip on every attempt.
 *
 * CAVEAT: this only rate-limits within a single instance. If auth-service is
 * ever run with more than one replica behind a load balancer, this needs to
 * move to Upstash Redis (already used elsewhere in this platform) for a
 * shared counter - noted here rather than silently, since it's an easy thing
 * to forget once horizontal scaling actually happens.
 */
@Component
public class DeletionRequestRateLimiter {

    private final Map<UUID, Instant> lastAttemptAt = new ConcurrentHashMap<>();
    private final AccountDeletionProperties accountDeletionProperties;

    public DeletionRequestRateLimiter(AccountDeletionProperties accountDeletionProperties) {
        this.accountDeletionProperties = accountDeletionProperties;
    }

    /** Throws if called again too soon for this user; otherwise records this attempt and returns normally. */
    public void checkAndRecord(UUID userId) {
        Duration cooldown = accountDeletionProperties.requestCooldown();
        Instant now = Instant.now();

        Instant[] rejected = new Instant[1];
        lastAttemptAt.compute(userId, (id, last) -> {
            if (last != null && now.isBefore(last.plus(cooldown))) {
                rejected[0] = last;
                return last; // unchanged - don't let a rejected attempt itself reset the window
            }
            return now;
        });

        if (rejected[0] != null) {
            long secondsLeft = now.until(rejected[0].plus(cooldown), ChronoUnit.SECONDS) + 1;
            throw new TooManyRequestsException("Please wait " + secondsLeft + " seconds before trying again");
        }
    }
}
