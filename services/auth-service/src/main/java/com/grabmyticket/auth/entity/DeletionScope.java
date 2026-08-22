package com.grabmyticket.auth.entity;

/**
 * Which persona(s) a deletion request tears down. CUSTOMER/ORGANIZER remove
 * just that role - the account and its other persona keep working
 * unaffected, unless removing that role happens to leave zero roles (a
 * single-role account), in which case AccountDeletionService treats it as a
 * full account deletion anyway. FULL_ACCOUNT always anonymizes the account
 * regardless of how many roles it holds.
 */
public enum DeletionScope {
    CUSTOMER,
    ORGANIZER,
    FULL_ACCOUNT
}
