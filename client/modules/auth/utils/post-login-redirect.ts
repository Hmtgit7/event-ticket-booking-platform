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

/**
 * Validates a `?redirect=` query param before trusting it as a post-login
 * destination - must be an internal, single-segment-rooted path (starts
 * with exactly one "/", never "//" or an absolute URL) to avoid an open
 * redirect. Returns null if the param is missing or looks unsafe.
 */
export function sanitizeRedirectParam(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  try {
    // Rejects anything that parses as an absolute URL (e.g. "/\evil.com" edge cases some browsers normalize).
    new URL(value, "http://localhost");
    return value;
  } catch {
    return null;
  }
}
