package com.grabmyticket.auth.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.grabmyticket.auth.entity.AuthProvider;
import com.grabmyticket.auth.entity.DeletionStatus;
import com.grabmyticket.auth.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);

    /** Admin user search (Phase 5) - matches on email or name, case-insensitive, partial. */
    Page<User> findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(String email, String fullName, Pageable pageable);

    /** Phase 9: AccountDeletionReaper's daily sweep - ids only, since finalizeIfStillEligible re-fetches each one fresh in its own transaction (see AccountDeletionReaper's class comment for why). */
    List<UUID> findIdsByDeletionStatusAndDeletionScheduledForBefore(DeletionStatus deletionStatus, Instant before);
}
