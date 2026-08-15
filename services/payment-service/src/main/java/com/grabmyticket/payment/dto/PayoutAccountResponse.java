package com.grabmyticket.payment.dto;

import com.grabmyticket.payment.entity.PayoutAccountStatus;

/** Never includes the full account number - bankAccountLast4 is all the frontend ever needs to show ("Account ending in 4821"). */
public record PayoutAccountResponse(
        String accountHolderName,
        String bankAccountLast4,
        String ifscCode,
        PayoutAccountStatus status,
        String failureReason
) {
}
