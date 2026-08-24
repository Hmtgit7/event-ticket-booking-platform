import { authApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type { AdminUserDetail, AdminUserSummary } from "@/interfaces/admin-user-api.interface";
import type { DeletionScope } from "@/interfaces/account-deletion.interface";
import type { MessageResponse } from "@/interfaces/auth.interface";

/** Thin wrapper over auth-service's /admin/users REST API. */
export const adminUsersService = {
  listUsers: (search: string, page = 0, size = 20) =>
    authApiClient.get<PageResponse<AdminUserSummary>>(
      `/admin/users?page=${page}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
    ),

  getUser: (id: string) => authApiClient.get<AdminUserDetail>(`/admin/users/${id}`),

  suspendUser: (id: string, reason: string) => authApiClient.patch(`/admin/users/${id}/suspend`, { reason }),

  reinstateUser: (id: string) => authApiClient.patch(`/admin/users/${id}/reinstate`, {}),

  /** Bypasses blockers/warnings/grace-period - see auth-service's AccountDeletionService.forceDelete for exactly what it can and can't override (e.g. never a live event with tickets sold). */
  forceDeleteUser: (id: string, scope: DeletionScope, reason: string) =>
    authApiClient.post<MessageResponse>(`/admin/users/${id}/force-delete`, { scope, reason }),
};
