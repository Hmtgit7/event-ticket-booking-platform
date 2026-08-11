import type { Metadata } from "next";
import { AdminUsersContainer } from "@/containers/admin-dashboard/users/admin-users-container";

export const metadata: Metadata = { title: "Users | Admin" };

export default function AdminUsersPage() {
  return <AdminUsersContainer />;
}
