package com.grabmyticket.event.repository;

import java.time.Instant;

import org.springframework.data.jpa.domain.Specification;

import com.grabmyticket.event.entity.Event;
import com.grabmyticket.event.entity.EventStatus;

/** Composable filters for the public event browse/search endpoint. */
public final class EventSpecifications {

    private EventSpecifications() {
    }

    public static Specification<Event> hasStatus(EventStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Event> hasCategory(String category) {
        if (category == null || category.isBlank()) {
            return null;
        }
        return (root, query, cb) -> cb.equal(cb.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<Event> hasCity(String city) {
        if (city == null || city.isBlank()) {
            return null;
        }
        return (root, query, cb) -> cb.equal(cb.lower(root.get("city")), city.toLowerCase());
    }

    public static Specification<Event> titleOrDescriptionContains(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }
        String pattern = "%" + search.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), pattern),
                cb.like(cb.lower(root.get("description")), pattern)
        );
    }

    public static Specification<Event> startsAfter(Instant from) {
        if (from == null) {
            return null;
        }
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("startAt"), from);
    }

    public static Specification<Event> startsBefore(Instant to) {
        if (to == null) {
            return null;
        }
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("startAt"), to);
    }

    /**
     * Chains only the non-null specs together - callers pass filters that may be null/blank freely.
     * Returns null (not Specification.where(null) - ambiguous overload in this Spring Data version)
     * when every filter is absent; JpaSpecificationExecutor#findAll accepts a null Specification to
     * mean "no filter".
     */
    @SafeVarargs
    public static Specification<Event> combine(Specification<Event>... specs) {
        Specification<Event> result = null;
        for (Specification<Event> spec : specs) {
            if (spec == null) {
                continue;
            }
            result = (result == null) ? spec : result.and(spec);
        }
        return result;
    }
}
