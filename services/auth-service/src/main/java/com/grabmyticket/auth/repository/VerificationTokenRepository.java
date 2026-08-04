package com.grabmyticket.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grabmyticket.auth.entity.TokenPurpose;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.entity.VerificationToken;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {

    Optional<VerificationToken> findByToken(String token);

    Optional<VerificationToken> findTopByUserOrderByCreatedAtDesc(User user);

    /** Per-purpose cooldown lookup - verify-email spam shouldn't block a reset-password request and vice versa. */
    Optional<VerificationToken> findTopByUserAndPurposeOrderByCreatedAtDesc(User user, TokenPurpose purpose);
}
