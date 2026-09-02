/**
 * Mirrors auth-service's RoleName enum (ROLE_USER, ROLE_ORGANIZER, ROLE_ADMIN).
 * Kept as a const object, not `enum`, matching client/enums/role.enum.ts's convention.
 */
export const Role = {
  User: "ROLE_USER",
  Organizer: "ROLE_ORGANIZER",
  Admin: "ROLE_ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
