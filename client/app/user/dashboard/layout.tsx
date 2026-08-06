import { UserDashboardShell } from "@/components/user-dashboard/shell/user-dashboard-shell";
import { RequireAuth } from "@/components/auth/require-auth";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <UserDashboardShell>{children}</UserDashboardShell>
    </RequireAuth>
  );
}
