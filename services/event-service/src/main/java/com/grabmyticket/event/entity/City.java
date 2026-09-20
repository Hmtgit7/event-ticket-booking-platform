package com.grabmyticket.event.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Static reference data - seeded once via V6__seed_cities.sql, never
 * written to by the application itself, so unlike every other entity in
 * this service there's no created_at/updated_at or @PrePersist/@PreUpdate
 * here. Backs three consumers: the city/country autocomplete endpoint
 * below, EventSpecifications.hasCity's exact-match filter (the frontend
 * passes back exactly what this endpoint returned), and later the
 * organizer event-creation form's auto-timezone fill from a picked city.
 * <p>
 * This is a curated seed (~100+ major cities across ~60 countries), not the
 * full GeoNames dataset - see V6's header comment for how to expand it.
 */
@Entity
@Table(name = "cities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    /** ISO 3166-1 alpha-2, e.g. "IN". */
    @Column(name = "country_code", nullable = false, length = 2)
    private String countryCode;

    @Column(name = "country_name", nullable = false, length = 100)
    private String countryName;

    /** State/province/region, e.g. "Maharashtra" - nullable, not every country has a meaningful admin division to show. */
    @Column(name = "admin_name", length = 100)
    private String adminName;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    /** IANA zone id, e.g. "Asia/Kolkata" - what an organizer's event.timezone gets auto-filled from when they pick this city (wired in a later chunk). */
    @Column(nullable = false, length = 50)
    private String timezone;

    /** Ranking signal for autocomplete ordering only - approximate, not kept in sync with reality. */
    private Integer population;
}
