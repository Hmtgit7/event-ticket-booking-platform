package com.grabmyticket.event.dto;

import com.grabmyticket.event.entity.City;

public record CitySuggestionResponse(
        String city,
        String countryCode,
        String country,
        /** Null when the city has no meaningful state/province to show. */
        String adminName,
        Double latitude,
        Double longitude,
        String timezone
) {
    public static CitySuggestionResponse from(City city) {
        return new CitySuggestionResponse(
                city.getName(),
                city.getCountryCode(),
                city.getCountryName(),
                city.getAdminName(),
                city.getLatitude(),
                city.getLongitude(),
                city.getTimezone()
        );
    }
}
