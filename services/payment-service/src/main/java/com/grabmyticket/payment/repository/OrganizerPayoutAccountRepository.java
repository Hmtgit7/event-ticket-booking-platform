package com.grabmyticket.payment.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grabmyticket.payment.entity.OrganizerPayoutAccount;

public interface OrganizerPayoutAccountRepository extends JpaRepository<OrganizerPayoutAccount, UUID> {

    Optional<OrganizerPayoutAccount> findByOrganizerId(UUID organizerId);
}
