package com.grabmyticket.auth.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.dto.AdminUserDetailResponse;
import com.grabmyticket.auth.dto.AdminUserSummaryResponse;
import com.grabmyticket.auth.dto.PageResponse;
import com.grabmyticket.auth.dto.RoleAction;
import com.grabmyticket.auth.entity.DeletionScope;
import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.RoleName;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.exception.InvalidRoleOperationException;
import com.grabmyticket.auth.exception.UserNotFoundException;
import com.grabmyticket.auth.repository.RoleRepository;
import com.grabmyticket.auth.repository.UserRepository;

/** Admin-only management of OTHER users' accounts. Called from AdminUserController, which is class-level @PreAuthorize("hasRole('ADMIN')"). */
@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditLogService auditLogService;
    private final RefreshTokenService refreshTokenService;
    private final AccountDeletionService accountDeletionService;

    public AdminUserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            AuditLogService auditLogService,
            RefreshTokenService refreshTokenService,
            AccountDeletionService accountDeletionService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.auditLogService = auditLogService;
        this.refreshTokenService = refreshTokenService;
        this.accountDeletionService = accountDeletionService;
    }

    @Transactional
    public void updateUserRole(UUID actingAdminId, UUID targetUserId, RoleName role, RoleAction action) {
        if (role == RoleName.ROLE_USER) {
            throw new InvalidRoleOperationException(
                    "ROLE_USER cannot be granted or revoked by an admin - the account holder adds or "
                            + "removes it themselves via the self-service persona flow (POST /auth/roles/user)");
        }
        if (action == RoleAction.REVOKE && role == RoleName.ROLE_ADMIN && targetUserId.equals(actingAdminId)) {
            throw new InvalidRoleOperationException("You cannot revoke your own admin access");
        }

        User user = userRepository.findById(targetUserId)
                .orElseThrow(UserNotFoundException::new);

        Role roleEntity = roleRepository.findByName(role)
                .orElseThrow(() -> new IllegalStateException(
                        "Role " + role + " is missing from the database - check V1 migration ran"));

        if (action == RoleAction.GRANT) {
            user.getRoles().add(roleEntity);
        } else {
            user.getRoles().remove(roleEntity);
        }

        userRepository.save(user);

        auditLogService.record(
                actingAdminId,
                action == RoleAction.GRANT ? AuditActions.ROLE_GRANTED : AuditActions.ROLE_REVOKED,
                AuditActions.TARGET_USER,
                targetUserId,
                role.name());
    }

    // ───────────────────────── Phase 5: account management ─────────────────────────

    @Transactional(readOnly = true)
    public PageResponse<AdminUserSummaryResponse> listUsers(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> users = (search == null || search.isBlank())
                ? userRepository.findAll(pageable)
                : userRepository.findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(search, search, pageable);
        return PageResponse.of(users.map(AdminUserSummaryResponse::from));
    }

    /** Every call is access-logged - viewing another user's PII (email, full name) is itself a privileged action worth an audit trail, per DPDP, not just mutations like suspend/role-change. */
    @Transactional
    public AdminUserDetailResponse getUser(UUID actingAdminId, UUID targetUserId) {
        User user = userRepository.findById(targetUserId).orElseThrow(UserNotFoundException::new);
        auditLogService.record(actingAdminId, AuditActions.USER_PII_VIEWED, AuditActions.TARGET_USER, targetUserId, null);
        return AdminUserDetailResponse.from(user);
    }

    @Transactional
    public void suspendUser(UUID actingAdminId, UUID targetUserId, String reason) {
        if (targetUserId.equals(actingAdminId)) {
            throw new InvalidRoleOperationException("You cannot suspend your own account");
        }

        User user = userRepository.findById(targetUserId).orElseThrow(UserNotFoundException::new);
        if (!user.isEnabled()) {
            return;
        }

        user.setEnabled(false);
        user.setSuspensionReason(reason);
        user.setSuspendedBy(actingAdminId);
        user.setSuspendedAt(java.time.Instant.now());
        userRepository.save(user);

        // Boot them out immediately, not just block future logins - a
        // suspended user's existing session shouldn't keep working until
        // its access token happens to expire on its own.
        refreshTokenService.revokeAllActiveTokensFor(user);

        auditLogService.record(actingAdminId, AuditActions.USER_SUSPENDED, AuditActions.TARGET_USER, targetUserId, reason);
    }

    @Transactional
    public void reinstateUser(UUID actingAdminId, UUID targetUserId) {
        User user = userRepository.findById(targetUserId).orElseThrow(UserNotFoundException::new);
        if (user.isEnabled()) {
            return;
        }

        user.setEnabled(true);
        user.setSuspensionReason(null);
        user.setSuspendedBy(null);
        user.setSuspendedAt(null);
        userRepository.save(user);

        auditLogService.record(actingAdminId, AuditActions.USER_REINSTATED, AuditActions.TARGET_USER, targetUserId, null);
    }

    // ───────────────────────── Phase 9: admin force-delete ─────────────────────────

    /** Thin delegation - AccountDeletionService owns every mechanic of what "delete" actually does (role removal, event-service cleanup, anonymize-or-reactivate, Kafka publish); this class only owns the admin-authorization surface, same split as everywhere else in this service. See AccountDeletionService.forceDelete's class comment for exactly what it bypasses and what it still refuses to. */
    public void forceDeleteUser(UUID actingAdminId, UUID targetUserId, DeletionScope scope, String reason) {
        accountDeletionService.forceDelete(actingAdminId, targetUserId, scope, reason);
    }
}
