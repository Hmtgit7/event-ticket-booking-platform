import type { Metadata } from "next";
import { AdminDashboardShell } from "@/components/admin-dashboard/shell/admin-dashboard-shell";
import { RequireAuth } from "@/components/auth/require-auth";
import { Role } from "@/enums/role.enum";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth anyOfRoles={[Role.Admin]} requireVerifiedEmail={false}>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </RequireAuth>
  );
}
