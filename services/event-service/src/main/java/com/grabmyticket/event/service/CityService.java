package com.grabmyticket.event.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.event.dto.CitySuggestionResponse;
import com.grabmyticket.event.repository.CityRepository;

@Service
public class CityService {

    private static final int MIN_QUERY_LENGTH = 2;
    private static final int MAX_RESULTS = 10;

    private final CityRepository cityRepository;

    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    /**
     * Below MIN_QUERY_LENGTH the trigram index barely narrows anything down
     * (a 1-character query matches almost every row by similarity), so it's
     * cheaper and more useful to just return nothing than to run the query.
     * limit is clamped, not trusted from the caller, to keep this a cheap
     * always-fast autocomplete call regardless of what a client passes.
     */
    @Transactional(readOnly = true)
    public List<CitySuggestionResponse> search(String query, Integer limit) {
        if (query == null || query.trim().length() < MIN_QUERY_LENGTH) {
            return List.of();
        }
        int effectiveLimit = (limit == null || limit < 1 || limit > MAX_RESULTS) ? MAX_RESULTS : limit;

        return cityRepository.search(query.trim(), effectiveLimit).stream()
                .map(CitySuggestionResponse::from)
                .toList();
    }
}
