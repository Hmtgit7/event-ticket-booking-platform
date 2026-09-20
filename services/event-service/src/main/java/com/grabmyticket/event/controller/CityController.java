package com.grabmyticket.event.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.grabmyticket.event.dto.CitySuggestionResponse;
import com.grabmyticket.event.service.CityService;

/**
 * No auth required - matches SecurityConfig's permitAll for "/geo/**".
 * Feeds both the public search bar's city/country autocomplete and the
 * organizer event-creation city picker, so it needs to work for logged-out
 * visitors too.
 */
@RestController
@RequestMapping("/geo/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping
    public ResponseEntity<List<CitySuggestionResponse>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer limit
    ) {
        return ResponseEntity.ok(cityService.search(q, limit));
    }
}
