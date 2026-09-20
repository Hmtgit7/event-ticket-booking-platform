package com.grabmyticket.auth.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * One row per (userId, scope) - up to three rows per user: GLOBAL (the
 * account default) plus optional CUSTOMER/ORGANIZER overrides. userId is a
 * plain column, not a JPA relation to User - same convention as
 * AdminAuditLog.actorId elsewhere in this service.
 *
 * language: BCP-47 tag, e.g. "en", "es-419". timezone: IANA zone id, e.g.
 * "Asia/Kolkata". country: ISO 3166-1 alpha-2, e.g. "IN". All three are
 * nullable - a null field on a CUSTOMER/ORGANIZER row means "inherit from
 * GLOBAL", not "unset"; a null field on the GLOBAL row falls back to the
 * hardcoded platform default (see UserPreferenceService.PLATFORM_DEFAULT_*).
 */
@Entity
@Table(name = "user_preferences", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "scope"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PreferenceScope scope;

    @Column(length = 10)
    private String language;

    @Column(length = 50)
    private String timezone;

    @Column(length = 2)
    private String country;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
