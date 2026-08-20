package com.grabmyticket.booking.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.grabmyticket.booking.entity.SupportTicket;
import com.grabmyticket.booking.entity.SupportTicketStatus;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, UUID> {

    Page<SupportTicket> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Optional<SupportTicket> findByIdAndUserId(UUID id, UUID userId);

    Page<SupportTicket> findByStatusOrderByCreatedAtDesc(SupportTicketStatus status, Pageable pageable);

    Page<SupportTicket> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
