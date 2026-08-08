package com.grabmyticket.event.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.grabmyticket.event.entity.TicketType;

public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {

    List<TicketType> findByEventId(UUID eventId);

    Optional<TicketType> findByIdAndEventId(UUID id, UUID eventId);

    /**
     * Atomic conditional decrement - the WHERE clause is the concurrency guard,
     * not an application-level read-then-write check. Two simultaneous reserve
     * calls for the last seat can't both succeed: whichever UPDATE commits
     * first wins, the second one's WHERE no longer matches and returns 0.
     */
    @Modifying
    @Query("UPDATE TicketType t SET t.quantityAvailable = t.quantityAvailable - :quantity "
            + "WHERE t.id = :id AND t.quantityAvailable >= :quantity")
    int reserveSeats(@Param("id") UUID id, @Param("quantity") int quantity);

    /** Rolls back a reserve (booking failed after seats were held) - capped at quantityTotal so it can never overshoot. */
    @Modifying
    @Query("UPDATE TicketType t SET t.quantityAvailable = LEAST(t.quantityAvailable + :quantity, t.quantityTotal) "
            + "WHERE t.id = :id")
    int releaseSeats(@Param("id") UUID id, @Param("quantity") int quantity);
}
