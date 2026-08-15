package com.grabmyticket.payment.service;

import java.util.UUID;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.payment.dto.PayoutAccountResponse;
import com.grabmyticket.payment.dto.SubmitPayoutAccountRequest;
import com.grabmyticket.payment.entity.OrganizerPayoutAccount;
import com.grabmyticket.payment.entity.PayoutAccountStatus;
import com.grabmyticket.payment.exception.PayoutAccountAlreadyActiveException;
import com.grabmyticket.payment.exception.PayoutAccountNotFoundException;
import com.grabmyticket.payment.repository.OrganizerPayoutAccountRepository;

/**
 * Owns the organizer's one-time payout-destination setup: submit bank
 * details -> Razorpay Contact -> Razorpay Fund Account -> ACTIVE. Nothing
 * here moves money - that's Phase 2c-ii's PayoutExecutionService, which
 * will read the resulting razorpayFundAccountId once it exists.
 */
@Service
@Transactional
public class PayoutAccountService {

    private final OrganizerPayoutAccountRepository repository;
    private final RazorpayXClient razorpayXClient;

    public PayoutAccountService(OrganizerPayoutAccountRepository repository, RazorpayXClient razorpayXClient) {
        this.repository = repository;
        this.razorpayXClient = razorpayXClient;
    }

    public PayoutAccountResponse submit(UUID organizerId, SubmitPayoutAccountRequest request) {
        repository.findByOrganizerId(organizerId).ifPresent(existing -> {
            if (existing.getStatus() == PayoutAccountStatus.ACTIVE) {
                // Changing payout bank details silently is a classic fraud
                // vector (compromise an account, redirect future payouts) -
                // deliberately not a self-service update. A FAILED account
                // can retry; an ACTIVE one needs an admin-mediated change
                // once Phase 5's organizer account management exists.
                throw new PayoutAccountAlreadyActiveException(
                        "A verified payout account already exists. Contact support to change it.");
            }
        });

        String last4 = request.bankAccountNumber().substring(request.bankAccountNumber().length() - 4);
        OrganizerPayoutAccount account = repository.findByOrganizerId(organizerId)
                .orElseGet(() -> OrganizerPayoutAccount.builder().organizerId(organizerId).build());
        account.setAccountHolderName(request.accountHolderName());
        account.setBankAccountLast4(last4);
        account.setIfscCode(request.ifscCode());
        account.setStatus(PayoutAccountStatus.PENDING);
        account.setFailureReason(null);

        try {
            JSONObject contact = razorpayXClient.createContact(request.accountHolderName(), organizerId.toString());
            String contactId = contact.getString("id");

            JSONObject fundAccount = razorpayXClient.createBankAccountFundAccount(
                    contactId, request.accountHolderName(), request.bankAccountNumber(), request.ifscCode());

            account.setRazorpayContactId(contactId);
            account.setRazorpayFundAccountId(fundAccount.getString("id"));
            account.setStatus(PayoutAccountStatus.ACTIVE);
        } catch (RazorpayXException ex) {
            account.setStatus(PayoutAccountStatus.FAILED);
            account.setFailureReason(ex.getMessage());
        }

        return toResponse(repository.save(account));
    }

    @Transactional(readOnly = true)
    public PayoutAccountResponse getMyPayoutAccount(UUID organizerId) {
        OrganizerPayoutAccount account = repository.findByOrganizerId(organizerId)
                .orElseThrow(PayoutAccountNotFoundException::new);
        return toResponse(account);
    }

    private PayoutAccountResponse toResponse(OrganizerPayoutAccount account) {
        return new PayoutAccountResponse(
                account.getAccountHolderName(),
                account.getBankAccountLast4(),
                account.getIfscCode(),
                account.getStatus(),
                account.getFailureReason()
        );
    }
}
