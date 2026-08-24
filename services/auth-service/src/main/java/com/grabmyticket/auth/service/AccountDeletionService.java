package com.grabmyticket.auth.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.client.EventServiceDeletionClient;
import com.grabmyticket.auth.config.AccountDeletionProperties;
import com.grabmyticket.auth.dto.AccountDeletionStatusResponse;
import com.grabmyticket.auth.dto.DeletionEligibilityResponse;
import com.grabmyticket.auth.entity.DeletionScope;
import com.grabmyticket.auth.entity.DeletionStatus;
import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.RoleName;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.event.AccountDeletedEvent;
import com.grabmyticket.auth.event.PersonaRemovedEvent;
import com.grabmyticket.auth.exception.DeletionAlreadyRequestedException;
import com.grabmyticket.auth.exception.DeletionBlockedException;
import com.grabmyticket.auth.exception.InvalidCredentialsException;
import com.grabmyticket.auth.exception.InvalidRoleOperationException;
import com.grabmyticket.auth.exception.NoDeletionRequestException;
import com.grabmyticket.auth.exception.UserNotFoundException;
import com.grabmyticket.auth.repository.RoleRepository;
import com.grabmyticket.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Owns the full account/profile deletion lifecycle: request (with a 14-day
 * grace period, see AccountDeletionProperties) -> cancel (self-service, any
 * time during the grace period) -> finalize (AccountDeletionReaper, once the
 * grace period elapses and eligibility still holds).
 *
 * Deliberately mirrors AdminUserService.suspendUser's shape (re-auth guard,
 * immediate token revocation, audit log written in the same transaction as
 * the mutation) even though this is self-service, not admin-only - the two
 * flows are conceptually siblings: both are "lock this account out", one
 * reversible by an admin, this one reversible by the user themselves during
 * the grace window.
 */
@Service
public class AccountDeletionService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final DeletionEligibilityService deletionEligibilityService;
    private final EventServiceDeletionClient eventServiceDeletionClient;
    private final RefreshTokenService refreshTokenService;
    private final AuditLogService auditLogService;
    private final AccountDeletionProperties accountDeletionProperties;
    private final ApplicationEventPublisher applicationEventPublisher;

    public AccountDeletionService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            DeletionEligibilityService deletionEligibilityService,
            EventServiceDeletionClient eventServiceDeletionClient,
            RefreshTokenService refreshTokenService,
            AuditLogService auditLogService,
            AccountDeletionProperties accountDeletionProperties,
            ApplicationEventPublisher applicationEventPublisher
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.deletionEligibilityService = deletionEligibilityService;
        this.eventServiceDeletionClient = eventServiceDeletionClient;
        this.refreshTokenService = refreshTokenService;
        this.auditLogService = auditLogService;
        this.accountDeletionProperties = accountDeletionProperties;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    @Transactional(readOnly = true)
    public DeletionEligibilityResponse checkEligibility(String currentUserId, DeletionScope scope) {
        User user = requireUser(currentUserId);
        requireRoleForScope(user, scope);
        return deletionEligibilityService.check(user, scope);
    }

    @Transactional
    public AccountDeletionStatusResponse requestDeletion(String currentUserId, DeletionScope scope, String currentPassword, boolean acknowledgeWarnings) {
        User user = requireUser(currentUserId);

        if (user.hasRole(RoleName.ROLE_ADMIN)) {
            throw new InvalidRoleOperationException(
                    "Admin accounts can't be deleted through self-service. Contact another admin.");
        }
        if (user.getDeletionStatus() == DeletionStatus.PENDING_DELETION) {
            throw new DeletionAlreadyRequestedException();
        }
        requireRoleForScope(user, scope);

        // Re-auth guard, same conditional-on-having-a-password logic as changePassword -
        // a Google-only account has no password_hash to check against.
        if (user.getPasswordHash() != null) {
            if (currentPassword == null || currentPassword.isBlank()
                    || !passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                throw new InvalidCredentialsException();
            }
        }

        DeletionEligibilityResponse eligibility = deletionEligibilityService.check(user, scope);
        if (!eligibility.eligible()) {
            throw new DeletionBlockedException(eligibility);
        }
        if (!eligibility.warnings().isEmpty() && !acknowledgeWarnings) {
            // Same 409 shape as a hard block - the frontend shows the warning list
            // (e.g. forfeitable wallet balance) and must resubmit with explicit consent.
            throw new DeletionBlockedException(eligibility);
        }

        Instant now = Instant.now();
        user.setDeletionStatus(DeletionStatus.PENDING_DELETION);
        user.setDeletionScope(scope);
        user.setDeletionRequestedAt(now);
        user.setDeletionScheduledFor(now.plus(accountDeletionProperties.gracePeriod()));
        userRepository.save(user);

        // Boot them out immediately, same reasoning as AdminUserService.suspendUser -
        // don't wait for their current access token to expire naturally. They can
        // still log back in during the grace period (issueTokenPair doesn't block
        // PENDING_DELETION the way it blocks a suspended account) specifically so
        // they're able to reach the cancel-deletion action.
        refreshTokenService.revokeAllActiveTokensFor(user);

        auditLogService.record(user.getId(), AuditActions.ACCOUNT_DELETION_REQUESTED, AuditActions.TARGET_USER, user.getId(), scope.name());

        return AccountDeletionStatusResponse.from(user);
    }

    @Transactional
    public void cancelDeletion(String currentUserId) {
        User user = requireUser(currentUserId);
        if (user.getDeletionStatus() != DeletionStatus.PENDING_DELETION) {
            throw new NoDeletionRequestException();
        }

        user.setDeletionStatus(DeletionStatus.ACTIVE);
        user.setDeletionScope(null);
        user.setDeletionRequestedAt(null);
        user.setDeletionScheduledFor(null);
        userRepository.save(user);

        auditLogService.record(user.getId(), AuditActions.ACCOUNT_DELETION_CANCELLED, AuditActions.TARGET_USER, user.getId(), null);
    }

    @Transactional(readOnly = true)
    public AccountDeletionStatusResponse getDeletionStatus(String currentUserId) {
        return AccountDeletionStatusResponse.from(requireUser(currentUserId));
    }

    // ───────────────────────── AccountDeletionReaper entry point ─────────────────────────

    /**
     * One user's grace period has elapsed - re-check eligibility (things can
     * change during 14 days: a chargeback, a new booking) and either finalize
     * or abort back to ACTIVE. Each user is its own transaction (see
     * AccountDeletionReaper) so one bad row never blocks the rest of the batch.
     */
    @Transactional
    public void finalizeIfStillEligible(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getDeletionStatus() != DeletionStatus.PENDING_DELETION) {
            return;
        }

        DeletionScope scope = user.getDeletionScope();
        DeletionEligibilityResponse recheck = deletionEligibilityService.check(user, scope);
        if (!recheck.eligible()) {
            user.setDeletionStatus(DeletionStatus.ACTIVE);
            user.setDeletionScope(null);
            user.setDeletionRequestedAt(null);
            user.setDeletionScheduledFor(null);
            userRepository.save(user);
            auditLogService.record(user.getId(), AuditActions.ACCOUNT_DELETION_BLOCKED, AuditActions.TARGET_USER, user.getId(),
                    "New pending item(s) appeared during the grace period - deletion aborted, account reactivated");
            return;
        }

        if (scope == DeletionScope.ORGANIZER || scope == DeletionScope.FULL_ACCOUNT) {
            if (user.hasRole(RoleName.ROLE_ORGANIZER)) {
                eventServiceDeletionClient.cleanup(user.getId());
                user.getRoles().remove(requireRole(RoleName.ROLE_ORGANIZER));
            }
        }
        if (scope == DeletionScope.CUSTOMER || scope == DeletionScope.FULL_ACCOUNT) {
            if (user.hasRole(RoleName.ROLE_USER)) {
                user.getRoles().remove(requireRole(RoleName.ROLE_USER));
            }
        }

        applyDeletion(user, scope);
        auditLogService.record(user.getId(), AuditActions.ACCOUNT_DELETION_FINALIZED, AuditActions.TARGET_USER, user.getId(), scope.name());
    }

    // ───────────────────────── AdminUserController entry point ─────────────────────────

    /**
     * Bypasses blockers, warnings, and the 14-day grace period entirely - the
     * point of "force". For stuck accounts (unresponsive organizer, abuse
     * cleanup, a DPDP/GDPR-style erasure request) where waiting on the
     * account holder to clear their own blockers isn't realistic.
     *
     * What this can NOT bypass: event-service's own refusal when a live/
     * upcoming event still has tickets sold (surfaces as
     * ForceDeleteBlockedException, a 409) - that's a data-integrity and
     * money-movement protection, not a "waiting on the user" blocker, and no
     * admin action should silently cancel a paying customer's ticket. An
     * admin who hits this must resolve those events first (via the existing
     * event moderation/cancellation tools) before force-deleting the organizer.
     */
    @Transactional
    public void forceDelete(UUID actingAdminId, UUID targetUserId, DeletionScope scope, String reason) {
        if (targetUserId.equals(actingAdminId)) {
            throw new InvalidRoleOperationException("Use self-service deletion for your own account, not the admin force-delete path");
        }

        User user = userRepository.findById(targetUserId).orElseThrow(UserNotFoundException::new);
        if (user.hasRole(RoleName.ROLE_ADMIN)) {
            throw new InvalidRoleOperationException("Admin accounts can't be force-deleted - revoke admin access first if this is truly intended");
        }
        requireRoleForScope(user, scope);

        // Fetched for the audit trail, not to block - the whole point of
        // "force" is that these blockers/warnings are deliberately overridden,
        // but the override itself must be visible afterward, not silent.
        DeletionEligibilityResponse bypassedEligibility = deletionEligibilityService.check(user, scope);

        if (scope == DeletionScope.ORGANIZER || scope == DeletionScope.FULL_ACCOUNT) {
            if (user.hasRole(RoleName.ROLE_ORGANIZER)) {
                eventServiceDeletionClient.cleanup(user.getId());
                user.getRoles().remove(requireRole(RoleName.ROLE_ORGANIZER));
            }
        }
        if (scope == DeletionScope.CUSTOMER || scope == DeletionScope.FULL_ACCOUNT) {
            if (user.hasRole(RoleName.ROLE_USER)) {
                user.getRoles().remove(requireRole(RoleName.ROLE_USER));
            }
        }

        refreshTokenService.revokeAllActiveTokensFor(user);
        applyDeletion(user, scope);

        String auditDetail = "reason: " + reason + (bypassedEligibility.eligible()
                ? ""
                : " | bypassed: " + bypassedEligibility.blockers().size() + " blocker(s), " + bypassedEligibility.warnings().size() + " warning(s)");
        auditLogService.record(actingAdminId, AuditActions.ACCOUNT_FORCE_DELETED, AuditActions.TARGET_USER, targetUserId, auditDetail);
    }

    @Transactional(readOnly = true)
    public List<UUID> findDueForFinalization() {
        return userRepository.findIdsByDeletionStatusAndDeletionScheduledForBefore(DeletionStatus.PENDING_DELETION, Instant.now());
    }

    // ───────────────────────── helpers ─────────────────────────

    /**
     * Role removal (see both callers above) must already be done before this
     * runs - this only decides FULL_ACCOUNT-vs-partial and does the
     * anonymize-or-reactivate + Kafka publish, shared identically by both
     * the self-service reaper and the admin force-delete path so they can
     * never drift apart on what "finalized" actually means.
     */
    private void applyDeletion(User user, DeletionScope scope) {
        boolean noRolesLeft = user.getRoles().isEmpty();
        if (scope == DeletionScope.FULL_ACCOUNT || noRolesLeft) {
            // Captured before anonymize() overwrites them - the Kafka event is
            // self-contained so notification-service can send a final
            // confirmation without reading the now-anonymized row back.
            String preAnonymizationEmail = user.getEmail();
            String preAnonymizationFullName = user.getFullName();

            anonymize(user);
            Instant deletedAt = Instant.now();
            user.setDeletionStatus(DeletionStatus.DELETED);
            user.setDeletedAt(deletedAt);
            userRepository.save(user);

            applicationEventPublisher.publishEvent(new AccountDeletedEvent(
                    AccountDeletedEvent.TYPE, user.getId(), preAnonymizationEmail, preAnonymizationFullName, deletedAt));
        } else {
            // Dual-role partial deletion - the account keeps working for its
            // remaining persona, so it's not "deleted", just back to normal
            // with one role permanently gone.
            Instant removedAt = Instant.now();
            user.setDeletionStatus(DeletionStatus.ACTIVE);
            user.setDeletionScope(null);
            user.setDeletionRequestedAt(null);
            user.setDeletionScheduledFor(null);
            if ("organizer".equals(user.getActivePersona()) && !user.hasRole(RoleName.ROLE_ORGANIZER)) {
                user.setActivePersona("user");
            }
            if ("user".equals(user.getActivePersona()) && !user.hasRole(RoleName.ROLE_USER)) {
                user.setActivePersona("organizer");
            }
            userRepository.save(user);

            applicationEventPublisher.publishEvent(new PersonaRemovedEvent(
                    PersonaRemovedEvent.TYPE, user.getId(), user.getEmail(), user.getFullName(), scope, removedAt));
        }
    }

    /**
     * email/fullName are overwritten with an opaque, non-reversible placeholder;
     * passwordHash/providerId cleared entirely. The row itself is kept, not
     * hard-deleted - booking-service/event-service financial and event history
     * still reference this userId and must keep resolving to *something*. See
     * the Phase 9 plan's data-retention section for the compliance reasoning
     * (Indian tax/GST record-keeping norms expect the underlying transactions
     * to survive even after the account behind them is gone).
     */
    private void anonymize(User user) {
        user.setEmail("deleted-user-" + user.getId() + "@grabmyticket.internal");
        user.setFullName("Deleted User");
        user.setPasswordHash(null);
        user.setProviderId(null);
        user.setEmailVerified(false);
    }

    private void requireRoleForScope(User user, DeletionScope scope) {
        if (scope == DeletionScope.CUSTOMER && !user.hasRole(RoleName.ROLE_USER)) {
            throw new InvalidRoleOperationException("This account is not a customer");
        }
        if (scope == DeletionScope.ORGANIZER && !user.hasRole(RoleName.ROLE_ORGANIZER)) {
            throw new InvalidRoleOperationException("This account is not an organizer");
        }
    }

    private User requireUser(String currentUserId) {
        return userRepository.findById(UUID.fromString(currentUserId))
                .orElseThrow(UserNotFoundException::new);
    }

    private Role requireRole(RoleName roleName) {
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException(
                        "Role " + roleName + " is missing from the database - check V1 migration ran"));
    }
}
