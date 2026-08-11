import type { Metadata } from "next";
import { AdminSettingsContainer } from "@/containers/admin-dashboard/settings/admin-settings-container";

export const metadata: Metadata = { title: "Settings | Admin" };

export default function AdminSettingsPage() {
  return <AdminSettingsContainer />;
}
