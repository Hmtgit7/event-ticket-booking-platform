package com.grabmyticket.booking.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.booking.dto.CreateSupportTicketRequest;
import com.grabmyticket.booking.dto.PageResponse;
import com.grabmyticket.booking.dto.SupportTicketResponse;
import com.grabmyticket.booking.service.SupportTicketService;

import jakarta.validation.Valid;

/**
 * Customer/organizer-facing ticket submission. Deliberately "USER or ORGANIZER"
 * rather than just ROLE_USER - an organizer-only account (hasn't added the
 * customer persona yet) should still be able to file a ticket.
 */
@RestController
@RequestMapping("/support/tickets")
@PreAuthorize("hasRole('USER') or hasRole('ORGANIZER')")
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    public SupportTicketController(SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    @PostMapping
    public ResponseEntity<SupportTicketResponse> createTicket(
            Authentication authentication, @Valid @RequestBody CreateSupportTicketRequest request
    ) {
        SupportTicketResponse response = supportTicketService.createTicket(userId(authentication), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mine")
    public ResponseEntity<PageResponse<SupportTicketResponse>> getMyTickets(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(supportTicketService.getMyTickets(userId(authentication), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportTicketResponse> getMyTicket(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(supportTicketService.getMyTicket(userId(authentication), id));
    }

    private UUID userId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
