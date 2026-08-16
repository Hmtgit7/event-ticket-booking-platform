package com.grabmyticket.event.controller;

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

import com.grabmyticket.event.dto.EventResponse;
import com.grabmyticket.event.dto.EventSummaryResponse;
import com.grabmyticket.event.dto.ModerateEventRequest;
import com.grabmyticket.event.dto.PageResponse;
import com.grabmyticket.event.entity.EventStatus;
import com.grabmyticket.event.service.EventService;

import jakarta.validation.Valid;

/**
 * Every endpoint here requires ROLE_ADMIN and operates on ANY event, not
 * scoped to an organizer - deliberate contrast with EventController, which
 * is organizer-scoped by design. adminId always comes from the JWT, never a
 * client-supplied value, same identity rule as every other admin endpoint
 * in this system.
 */
@RestController
@RequestMapping("/admin/events")
@PreAuthorize("hasRole('ADMIN')")
public class AdminEventController {

    private final EventService eventService;

    public AdminEventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<EventSummaryResponse>> listAllEvents(
            @RequestParam(required = false) EventStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(eventService.listAllEventsForAdmin(status, page, size));
    }

    @PatchMapping("/{id}/flag")
    public ResponseEntity<EventResponse> flagEvent(
            Authentication authentication, @PathVariable UUID id, @Valid @RequestBody ModerateEventRequest request
    ) {
        return ResponseEntity.ok(eventService.flagEvent(adminId(authentication), id, request));
    }

    @PatchMapping("/{id}/unflag")
    public ResponseEntity<EventResponse> unflagEvent(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(eventService.unflagEvent(adminId(authentication), id));
    }

    @PatchMapping("/{id}/remove")
    public ResponseEntity<EventResponse> removeEvent(
            Authentication authentication, @PathVariable UUID id, @Valid @RequestBody ModerateEventRequest request
    ) {
        return ResponseEntity.ok(eventService.removeEvent(adminId(authentication), id, request));
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<EventResponse> restoreEvent(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(eventService.restoreEvent(adminId(authentication), id));
    }

    private UUID adminId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
