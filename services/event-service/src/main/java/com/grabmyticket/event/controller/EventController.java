package com.grabmyticket.event.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.event.dto.CreateEventRequest;
import com.grabmyticket.event.dto.EventResponse;
import com.grabmyticket.event.dto.EventSummaryResponse;
import com.grabmyticket.event.dto.PageResponse;
import com.grabmyticket.event.dto.TicketTypeRequest;
import com.grabmyticket.event.dto.TicketTypeResponse;
import com.grabmyticket.event.dto.UpdateEventRequest;
import com.grabmyticket.event.service.EventService;

import jakarta.validation.Valid;

/** Organizer-facing event management. Every endpoint here requires ROLE_ORGANIZER and operates only on the caller's own events. */
@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponse> createEvent(Authentication authentication, @Valid @RequestBody CreateEventRequest request) {
        EventResponse response = eventService.createEvent(organizerId(authentication), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponse> updateEvent(
            Authentication authentication, @PathVariable UUID id, @Valid @RequestBody UpdateEventRequest request
    ) {
        return ResponseEntity.ok(eventService.updateEvent(organizerId(authentication), id, request));
    }

    @PostMapping("/{id}/ticket-types")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<TicketTypeResponse> addTicketType(
            Authentication authentication, @PathVariable UUID id, @Valid @RequestBody TicketTypeRequest request
    ) {
        TicketTypeResponse response = eventService.addTicketType(organizerId(authentication), id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/ticket-types/{ticketTypeId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<TicketTypeResponse> updateTicketType(
            Authentication authentication,
            @PathVariable UUID id,
            @PathVariable UUID ticketTypeId,
            @Valid @RequestBody TicketTypeRequest request
    ) {
        return ResponseEntity.ok(eventService.updateTicketType(organizerId(authentication), id, ticketTypeId, request));
    }

    @DeleteMapping("/{id}/ticket-types/{ticketTypeId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Void> deleteTicketType(
            Authentication authentication, @PathVariable UUID id, @PathVariable UUID ticketTypeId
    ) {
        eventService.deleteTicketType(organizerId(authentication), id, ticketTypeId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponse> publishEvent(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(eventService.publishEvent(organizerId(authentication), id));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponse> cancelEvent(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(eventService.cancelEvent(organizerId(authentication), id));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<PageResponse<EventSummaryResponse>> listMyEvents(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(eventService.listMyEvents(organizerId(authentication), page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponse> getMyEvent(Authentication authentication, @PathVariable UUID id) {
        return ResponseEntity.ok(eventService.getMyEvent(organizerId(authentication), id));
    }

    private UUID organizerId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
