/**
 * Shapes for auth-service's /admin/users endpoints. Field names match
 * AdminUserSummaryResponse.java / AdminUserDetailResponse.java exactly.
 * roles is a set of raw role strings (e.g. "ROLE_USER", "ROLE_ORGANIZER",
 * "ROLE_ADMIN") - an account can hold more than one under the dual-role
 * persona model, so this is never a single enum value like the old mock data.
 */

export interface AdminUserSummary {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  enabled: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUserSummary {
  activePersona: string | null;
  suspensionReason: string | null;
  suspendedBy: string | null;
  suspendedAt: string | null;
}
