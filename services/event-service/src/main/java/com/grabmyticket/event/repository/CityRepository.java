package com.grabmyticket.event.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.grabmyticket.event.entity.City;

public interface CityRepository extends JpaRepository<City, UUID> {

    /**
     * Typeahead search across city name AND country name (so "ind" surfaces
     * Indian cities, not just cities literally named "Ind..."), ranked
     * prefix-matches-first, then by trigram similarity, then by population
     * so major cities surface before minor ones on an ambiguous query.
     * Requires the pg_trgm extension - see V5 migration.
     */
    @Query(value = """
            SELECT * FROM cities
            WHERE name ILIKE CONCAT(:query, '%')
               OR country_name ILIKE CONCAT(:query, '%')
               OR name % :query
               OR country_name % :query
            ORDER BY
                (name ILIKE CONCAT(:query, '%')) DESC,
                GREATEST(similarity(name, :query), similarity(country_name, :query)) DESC,
                population DESC NULLS LAST
            LIMIT :limit
            """, nativeQuery = true)
    List<City> search(@Param("query") String query, @Param("limit") int limit);
}
