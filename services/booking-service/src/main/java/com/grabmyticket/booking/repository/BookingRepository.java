package com.grabmyticket.booking.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.grabmyticket.booking.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Page<Booking> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Optional<Booking> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByBookingCode(String bookingCode);
}
