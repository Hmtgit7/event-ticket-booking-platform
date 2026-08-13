package com.grabmyticket.booking.dto;

import java.math.BigDecimal;

/**
 * UNUSED as of the payment-service split - WalletController no longer has a
 * recharge endpoint (recharges start at payment-service's
 * POST /payments/orders and land here only via PaymentEventListener). Kept
 * only because this MCP session has no file-delete capability - safe to
 * delete this file manually (git rm) whenever convenient.
 */
public record RechargeWalletRequest(BigDecimal amount) {
}
