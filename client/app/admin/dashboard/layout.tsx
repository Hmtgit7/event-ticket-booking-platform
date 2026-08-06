import { AdminDashboardShell } from "@/components/admin-dashboard/shell/admin-dashboard-shell";
import { RequireAuth } from "@/components/auth/require-auth";
import { Role } from "@/enums/role.enum";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth anyOfRoles={[Role.Admin]}>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </RequireAuth>
  );
}
