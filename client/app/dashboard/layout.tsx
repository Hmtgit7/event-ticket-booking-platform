import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireAuth } from "@/components/auth/require-auth";
import { Role } from "@/enums/role.enum";

// Applies to every page under /dashboard (organizer area) unless a page
// overrides it — none do, so the whole authenticated section stays out of
// search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth anyOfRoles={[Role.Organizer]}>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  );
}
