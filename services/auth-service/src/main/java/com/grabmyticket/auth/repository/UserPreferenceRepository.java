package com.grabmyticket.auth.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grabmyticket.auth.entity.PreferenceScope;
import com.grabmyticket.auth.entity.UserPreference;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, UUID> {

    Optional<UserPreference> findByUserIdAndScope(UUID userId, PreferenceScope scope);

    /** Used on account deletion/anonymization cleanup - all scopes for one user in one go. */
    List<UserPreference> findByUserId(UUID userId);
}
