package com.grabmyticket.auth.entity;

/**
 * The fixed set of roles seeded by V1__create_users_and_roles.sql.
 * Adding a new role means a new migration row here AND in the DB seed insert,
 * not just a code change - keeps roles table and this enum in sync by convention.
 */
public enum RoleName {
    ROLE_USER,
    ROLE_ORGANIZER,
    ROLE_ADMIN
}
