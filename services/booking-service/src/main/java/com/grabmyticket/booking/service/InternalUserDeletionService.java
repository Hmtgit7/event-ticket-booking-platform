package com.grabmyticket.booking.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.booking.dto.AvailableBalanceResponse;
import com.grabmyticket.booking.dto.internal.DeletionBlocker;
import com.grabmyticket.booking.dto.internal.DeletionCheckResponse;
import com.grabmyticket.booking.entity.BookingStatus;
import com.grabmyticket.booking.entity.CancellationStatus;
import com.grabmyticket.booking.entity.PayoutStatus;
import com.grabmyticket.booking.entity.RelatedEntityType;
import com.grabmyticket.booking.entity.SupportTicketStatus;
import com.grabmyticket.booking.entity.Wallet;
import com.grabmyticket.booking.repository.BookingRepository;
import com.grabmyticket.booking.repository.CancellationRequestRepository;
import com.grabmyticket.booking.repository.PayoutRequestRepository;
import com.grabmyticket.booking.repository.SupportTicketRepository;
import com.grabmyticket.booking.repository.WalletRepository;

/**
 * Server-to-server contract for auth-service's account-deletion flow - same
 * "separate service class for a different caller" reasoning as
 * InternalCatalogService, not new branches inside BookingService/PayoutService/etc.
 *
 * Everything here is a pure read (this service never mutates anything for
 * account deletion - unlike event-service's cleanup step, there's nothing to
 * archive/cancel on the booking side; bookings, wallet transactions and
 * payout records are all kept forever regardless of whether the account
 * behind them is later deleted, since they're the platform's own financial
 * history, not the user's personal content).
 */
@Service
@Transactional(readOnly = true)
public class InternalUserDeletionService {

    private static final List<SupportTicketStatus> OPEN_TICKET_STATUSES =
            List.of(SupportTicketStatus.OPEN, SupportTicketStatus.IN_PROGRESS);
    private static final List<RelatedEntityType> CUSTOMER_TICKET_TYPES =
            List.of(RelatedEntityType.BOOKING, RelatedEntityType.CANCELLATION_REQUEST);
    private static final List<RelatedEntityType> ORGANIZER_TICKET_TYPES =
            List.of(RelatedEntityType.PAYOUT_REQUEST);
    private static final List<PayoutStatus> PENDING_PAYOUT_STATUSES =
            List.of(PayoutStatus.REQUESTED, PayoutStatus.APPROVED);

    private final BookingRepository bookingRepository;
    private final CancellationRequestRepository cancellationRequestRepository;
    private final PayoutRequestRepository payoutRequestRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final WalletRepository walletRepository;
    private final PayoutService payoutService;

    public InternalUserDeletionService(
            BookingRepository bookingRepository,
            CancellationRequestRepository cancellationRequestRepository,
            PayoutRequestRepository payoutRequestRepository,
            SupportTicketRepository supportTicketRepository,
            WalletRepository walletRepository,
            PayoutService payoutService
    ) {
        this.bookingRepository = bookingRepository;
        this.cancellationRequestRepository = cancellationRequestRepository;
        this.payoutRequestRepository = payoutRequestRepository;
        this.supportTicketRepository = supportTicketRepository;
        this.walletRepository = walletRepository;
        this.payoutService = payoutService;
    }

    /**
     * C1/C2/C3/C4 as hard blockers; a nonzero wallet balance (C5) is a
     * WARNING, not a blocker - the wallet is closed-loop/spend-only with no
     * withdrawal path, so auth-service surfaces this to the frontend as a
     * forfeit-with-consent checkbox rather than trapping the user forever.
     */
    public DeletionCheckResponse checkCustomerDeletionEligibility(UUID userId) {
        Instant now = Instant.now();
        List<DeletionBlocker> blockers = new ArrayList<>();

        long pendingBookings = bookingRepository.countByUserIdAndStatus(userId, BookingStatus.PENDING);
        if (pendingBookings > 0) {
            blockers.add(new DeletionBlocker("PENDING_BOOKING",
                    pendingBookings + " booking" + (pendingBookings == 1 ? " is" : "s are") + " still awaiting payment confirmation",
                    (int) pendingBookings));
        }

        long pendingCancellations = cancellationRequestRepository.countByUserIdAndStatus(userId, CancellationStatus.REQUESTED);
        if (pendingCancellations > 0) {
            blockers.add(new DeletionBlocker("CANCELLATION_PENDING",
                    pendingCancellations + " cancellation request" + (pendingCancellations == 1 ? " is" : "s are") + " still awaiting review",
                    (int) pendingCancellations));
        }

        long upcomingTickets = bookingRepository.countByUserIdAndStatusAndEventStartAtAfter(userId, BookingStatus.CONFIRMED, now);
        if (upcomingTickets > 0) {
            blockers.add(new DeletionBlocker("UPCOMING_TICKET",
                    "You hold " + upcomingTickets + " confirmed ticket" + (upcomingTickets == 1 ? "" : "s") + " to an upcoming event",
                    (int) upcomingTickets));
        }

        long openTickets = supportTicketRepository.countOpenByUserIdAndRelatedTypes(userId, OPEN_TICKET_STATUSES, CUSTOMER_TICKET_TYPES);
        if (openTickets > 0) {
            blockers.add(new DeletionBlocker("OPEN_SUPPORT_TICKET",
                    openTickets + " support ticket" + (openTickets == 1 ? " is" : "s are") + " still open",
                    (int) openTickets));
        }

        List<DeletionBlocker> warnings = new ArrayList<>();
        BigDecimal walletBalance = walletRepository.findByUserId(userId).map(Wallet::getBalance).orElse(BigDecimal.ZERO);
        if (walletBalance.compareTo(BigDecimal.ZERO) > 0) {
            warnings.add(new DeletionBlocker("WALLET_BALANCE_FORFEIT",
                    "Your wallet balance of \u20B9" + walletBalance + " will be forfeited and cannot be recovered",
                    walletBalance.intValue()));
        }

        return DeletionCheckResponse.of(blockers, warnings);
    }

    /**
     * O3/O4/O5 as hard blockers. Unlike the customer-side wallet balance,
     * available payout balance (O4) IS a hard block, not a warning - this is
     * the organizer's own earned revenue, not a promotional credit, so
     * silently forfeiting it on deletion isn't an acceptable default.
     */
    public DeletionCheckResponse checkOrganizerDeletionEligibility(UUID organizerId) {
        List<DeletionBlocker> blockers = new ArrayList<>();

        long pendingPayouts = payoutRequestRepository.countByOrganizerIdAndStatusIn(organizerId, PENDING_PAYOUT_STATUSES);
        if (pendingPayouts > 0) {
            blockers.add(new DeletionBlocker("PAYOUT_PENDING",
                    pendingPayouts + " payout request" + (pendingPayouts == 1 ? " is" : "s are") + " still mid-review",
                    (int) pendingPayouts));
        }

        AvailableBalanceResponse balance = payoutService.getAvailableBalance(organizerId);
        if (balance.availableBalance().compareTo(BigDecimal.ZERO) > 0) {
            blockers.add(new DeletionBlocker("PAYOUT_BALANCE_UNCLAIMED",
                    "You have an unclaimed payout balance of \u20B9" + balance.availableBalance() + " - request a payout before deleting your organizer profile",
                    balance.availableBalance().intValue()));
        }

        long openTickets = supportTicketRepository.countOpenByUserIdAndRelatedTypes(organizerId, OPEN_TICKET_STATUSES, ORGANIZER_TICKET_TYPES);
        if (openTickets > 0) {
            blockers.add(new DeletionBlocker("OPEN_SUPPORT_TICKET",
                    openTickets + " support ticket" + (openTickets == 1 ? " is" : "s are") + " still open",
                    (int) openTickets));
        }

        return DeletionCheckResponse.of(blockers, List.of());
    }
}
