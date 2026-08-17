import { authApiClient } from "@/lib/api-client";
import type { PageResponse } from "@/interfaces/event-api.interface";
import type { AdminUserDetail, AdminUserSummary } from "@/interfaces/admin-user-api.interface";

/** Thin wrapper over auth-service's /admin/users REST API. */
export const adminUsersService = {
  listUsers: (search: string, page = 0, size = 20) =>
    authApiClient.get<PageResponse<AdminUserSummary>>(
      `/admin/users?page=${page}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
    ),

  getUser: (id: string) => authApiClient.get<AdminUserDetail>(`/admin/users/${id}`),

  suspendUser: (id: string, reason: string) => authApiClient.patch(`/admin/users/${id}/suspend`, { reason }),

  reinstateUser: (id: string) => authApiClient.patch(`/admin/users/${id}/reinstate`, {}),
};
