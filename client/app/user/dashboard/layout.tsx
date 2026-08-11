import type { Metadata } from "next";
import { UserDashboardShell } from "@/components/user-dashboard/shell/user-dashboard-shell";
import { RequireAuth } from "@/components/auth/require-auth";
import { Role } from "@/enums/role.enum";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth anyOfRoles={[Role.User]}>
      <UserDashboardShell>{children}</UserDashboardShell>
    </RequireAuth>
  );
}
