package com.grabmyticket.auth.service;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Daily sweep that finalizes any PENDING_DELETION account whose grace period
 * has elapsed. Each user is finalized in its own transaction
 * (AccountDeletionService.finalizeIfStillEligible is @Transactional per-call,
 * not wrapped in one big transaction here) so a single failure - a
 * booking-service/event-service outage, an unexpected exception - never
 * blocks the rest of the day's batch; that one row just gets picked up again
 * on tomorrow's run since it's still PENDING_DELETION with a scheduledFor in
 * the past.
 */
@Component
public class AccountDeletionReaper {

    private static final Logger log = LoggerFactory.getLogger(AccountDeletionReaper.class);

    private final AccountDeletionService accountDeletionService;

    public AccountDeletionReaper(AccountDeletionService accountDeletionService) {
        this.accountDeletionService = accountDeletionService;
    }

    /** 03:00 daily - off-peak, same reasoning as any other batch job that doesn't need to run more often than once a day. */
    @Scheduled(cron = "0 0 3 * * *")
    public void run() {
        List<UUID> dueUserIds = accountDeletionService.findDueForFinalization();
        if (dueUserIds.isEmpty()) {
            return;
        }

        log.info("AccountDeletionReaper: {} account(s) due for finalization", dueUserIds.size());
        for (UUID userId : dueUserIds) {
            try {
                accountDeletionService.finalizeIfStillEligible(userId);
            } catch (Exception ex) {
                log.error("AccountDeletionReaper: failed to finalize user {} - will retry on next run", userId, ex);
            }
        }
    }
}
