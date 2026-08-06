import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireAuth } from "@/components/auth/require-auth";
import { Role } from "@/enums/role.enum";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth anyOfRoles={[Role.Organizer]}>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  );
}
