package com.grabmyticket.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SubmitPayoutAccountRequest(
        @NotBlank
        String accountHolderName,

        @NotBlank
        @Pattern(regexp = "\\d{9,18}", message = "Enter a valid bank account number")
        String bankAccountNumber,

        @NotBlank
        @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Enter a valid IFSC code")
        String ifscCode
) {
}
