package com.grabmyticket.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddPayoutAccountRequest(
        @NotBlank @Size(min = 3, max = 100) String accountHolderName,
        @NotBlank @Pattern(regexp = "\\d{9,18}", message = "Bank account number must be 9-18 digits") String bankAccountNumber,
        @NotBlank @Pattern(regexp = "[A-Z]{4}0[A-Z0-9]{6}", message = "Enter a valid IFSC code") String ifscCode
) {
}
