package com.grabmyticket.auth.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.dto.RoleAction;
import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.RoleName;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.exception.InvalidRoleOperationException;
import com.grabmyticket.auth.exception.UserNotFoundException;
import com.grabmyticket.auth.repository.RoleRepository;
import com.grabmyticket.auth.repository.UserRepository;

/** Admin-only management of OTHER users' roles. Called from AdminUserController, which is class-level @PreAuthorize("hasRole('ADMIN')"). */
@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditLogService auditLogService;

    public AdminUserService(UserRepository userRepository, RoleRepository roleRepository, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.auditLogService = auditLogService;
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
}
