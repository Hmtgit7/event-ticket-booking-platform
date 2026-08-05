package com.grabmyticket.event.controller;

import java.time.Instant;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.event.dto.EventResponse;
import com.grabmyticket.event.dto.EventSummaryResponse;
import com.grabmyticket.event.dto.PageResponse;
import com.grabmyticket.event.service.EventService;

/** No auth required - matches SecurityConfig's permitAll for "/events/public/**". Only ever returns PUBLISHED events. */
@RestController
@RequestMapping("/events/public")
public class PublicEventController {

    private final EventService eventService;

    public PublicEventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<EventSummaryResponse>> listPublicEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Instant fromDate,
            @RequestParam(required = false) Instant toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(
                eventService.listPublicEvents(category, city, search, fromDate, toDate, page, size));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<EventResponse> getPublicEvent(@PathVariable String slug) {
        return ResponseEntity.ok(eventService.getPublicEventBySlug(slug));
    }
}
