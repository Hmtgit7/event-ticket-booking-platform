package com.grabmyticket.auth.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.dto.AdminAuditLogResponse;
import com.grabmyticket.auth.dto.PageResponse;
import com.grabmyticket.auth.entity.AdminAuditLog;
import com.grabmyticket.auth.repository.AdminAuditLogRepository;

/**
 * The one place this service ever writes an audit entry. record() is called
 * from inside the same @Transactional method that performs the privileged
 * action itself (AdminUserService.updateUserRole, AdminAuthService.bootstrap)
 * so the action and its audit trail either both commit or both roll back -
 * never one without the other.
 */
@Service
public class AuditLogService {

    private final AdminAuditLogRepository repository;

    public AuditLogService(AdminAuditLogRepository repository) {
        this.repository = repository;
    }

    public void record(UUID actorId, String action, String targetType, UUID targetId, String reason) {
        repository.save(AdminAuditLog.builder()
                .actorId(actorId)
                .action(action)
                .targetType(targetType)
                .targetId(targetId)
                .reason(reason)
                .createdAt(Instant.now())
                .build());
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminAuditLogResponse> getAuditLog(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AdminAuditLog> entries = repository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.of(entries.map(this::toResponse));
    }

    private AdminAuditLogResponse toResponse(AdminAuditLog log) {
        return new AdminAuditLogResponse(log.getId(), log.getActorId(), log.getAction(), log.getTargetType(), log.getTargetId(), log.getReason(), log.getCreatedAt());
    }
}
