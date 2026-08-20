package com.grabmyticket.booking.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.dto.SupportTicketResponse;
import com.grabmyticket.booking.dto.UpdateSupportTicketRequest;
import com.grabmyticket.booking.entity.SupportTicketStatus;
import com.grabmyticket.booking.service.SupportTicketService;

/**
 * Admin triage. A single combined PATCH covers status/priority/resolutionNote/
 * assignedAdminId together - unlike payouts/cancellations, an admin normally
 * edits these fields as one action when actually working a ticket, so there's
 * no separate approve/reject split here.
 */
@RestController
@RequestMapping("/admin/support/tickets")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSupportTicketController {

    private final SupportTicketService supportTicketService;

    public AdminSupportTicketController(SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<SupportTicketResponse>> getAllTickets(
            @RequestParam(required = false) SupportTicketStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(supportTicketService.getAllTickets(status, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportTicketResponse> getTicket(@PathVariable UUID id) {
        return ResponseEntity.ok(supportTicketService.getTicket(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SupportTicketResponse> updateTicket(
            Authentication authentication, @PathVariable UUID id, @RequestBody UpdateSupportTicketRequest request
    ) {
        return ResponseEntity.ok(supportTicketService.updateTicket(adminId(authentication), id, request));
    }

    private UUID adminId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
