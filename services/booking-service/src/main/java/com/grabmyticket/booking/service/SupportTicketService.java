package com.grabmyticket.booking.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.booking.dto.CreateSupportTicketRequest;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.dto.SupportTicketResponse;
import com.grabmyticket.booking.dto.UpdateSupportTicketRequest;
import com.grabmyticket.booking.entity.SupportTicket;
import com.grabmyticket.booking.entity.SupportTicketStatus;
import com.grabmyticket.booking.exception.SupportTicketNotFoundException;
import com.grabmyticket.booking.repository.SupportTicketRepository;

/**
 * Owns the support ticket lifecycle: submission (customer/organizer) and
 * triage (admin). Deliberately lightweight - this is a lifecycle tracker,
 * not a threaded chat system, so there's no message thread entity here.
 * Ticket creation is not audit-logged (only admin review actions are,
 * matching the payout/cancellation convention where the *request* isn't
 * logged but the *decision* is); updateTicket is the one place this
 * service writes an audit entry.
 */
@Service
@Transactional
public class SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;
    private final AuditLogService auditLogService;

    public SupportTicketService(SupportTicketRepository supportTicketRepository, AuditLogService auditLogService) {
        this.supportTicketRepository = supportTicketRepository;
        this.auditLogService = auditLogService;
    }

    public SupportTicketResponse createTicket(UUID userId, CreateSupportTicketRequest request) {
        SupportTicket ticket = supportTicketRepository.save(SupportTicket.builder()
                .userId(userId)
                .subject(request.subject())
                .description(request.description())
                .category(request.category())
                .relatedEntityType(request.relatedEntityType())
                .relatedEntityId(request.relatedEntityId())
                .build());
        return toResponse(ticket);
    }

    @Transactional(readOnly = true)
    public PageResponse<SupportTicketResponse> getMyTickets(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<SupportTicket> tickets = supportTicketRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PageResponse.of(tickets.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public SupportTicketResponse getMyTicket(UUID userId, UUID ticketId) {
        SupportTicket ticket = supportTicketRepository.findByIdAndUserId(ticketId, userId)
                .orElseThrow(SupportTicketNotFoundException::new);
        return toResponse(ticket);
    }

    // ───────────────────────── admin ─────────────────────────

    @Transactional(readOnly = true)
    public PageResponse<SupportTicketResponse> getAllTickets(SupportTicketStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<SupportTicket> tickets = status != null
                ? supportTicketRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                : supportTicketRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.of(tickets.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public SupportTicketResponse getTicket(UUID ticketId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(SupportTicketNotFoundException::new);
        return toResponse(ticket);
    }

    public SupportTicketResponse updateTicket(UUID adminId, UUID ticketId, UpdateSupportTicketRequest request) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(SupportTicketNotFoundException::new);

        if (request.status() != null) {
            ticket.setStatus(request.status());
        }
        if (request.priority() != null) {
            ticket.setPriority(request.priority());
        }
        if (request.resolutionNote() != null) {
            ticket.setResolutionNote(request.resolutionNote());
        }
        if (request.assignedAdminId() != null) {
            ticket.setAssignedAdminId(request.assignedAdminId());
        }
        SupportTicket saved = supportTicketRepository.save(ticket);

        auditLogService.record(adminId, AuditActions.SUPPORT_TICKET_UPDATED, AuditActions.TARGET_SUPPORT_TICKET, saved.getId(), request.resolutionNote());
        return toResponse(saved);
    }

    // ───────────────────────── helpers ─────────────────────────

    private SupportTicketResponse toResponse(SupportTicket ticket) {
        return new SupportTicketResponse(
                ticket.getId(),
                ticket.getUserId(),
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getCategory(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getRelatedEntityType(),
                ticket.getRelatedEntityId(),
                ticket.getResolutionNote(),
                ticket.getAssignedAdminId(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }
}
