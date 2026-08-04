import { UserDashboardShell } from "@/components/user-dashboard/shell/user-dashboard-shell";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return <UserDashboardShell>{children}</UserDashboardShell>;
}
