import { Role } from "@/enums/role.enum";

/**
 * Centralized so it only needs to change in one place as real dashboards get
 * built out. Priority: ADMIN's own dashboard first (even if they also hold
 * other roles), then ORGANIZER's, then the plain USER placeholder.
 */
export function resolvePostLoginRedirect(roles: Role[]): string {
  if (roles.includes(Role.Admin)) {
    return "/admin/dashboard";
  }
  if (roles.includes(Role.Organizer)) {
    return "/dashboard";
  }
  return "/user/dashboard";
}
