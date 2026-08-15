package com.grabmyticket.booking.dto;

/** Body for PATCH /admin/payouts/{id}/reject - note is required so there's always a reason on record, per the audit-trail requirement every admin action needs. */
public record RejectPayoutRequest(String note) {
}
