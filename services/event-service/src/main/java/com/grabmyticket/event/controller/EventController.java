package com.grabmyticket.event.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * PLACEHOLDER endpoints to prove the JWT/RBAC wiring works end-to-end
 * (auth-service's token accepted here, roles enforced correctly). Real Event
 * domain (entities, CRUD, Flyway migration) is separate future work - do not
 * build on top of this controller, replace it.
 */
@RestController
@RequestMapping("/events")
public class EventController {

    @GetMapping("/public/ping")
    public ResponseEntity<Map<String, String>> publicPing() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "event-service"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Map<String, String>> createEventPlaceholder() {
        return ResponseEntity.ok(Map.of(
                "message", "RBAC check passed - you have ROLE_ORGANIZER. Real event creation isn't built yet."
        ));
    }
}
