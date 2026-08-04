import { AdminDashboardShell } from "@/components/admin-dashboard/shell/admin-dashboard-shell";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}
