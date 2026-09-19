import type { Metadata } from "next";
import { SettingsShell } from "@/components/settings/settings-shell";
import { ADMIN_SETTINGS_NAV_ITEMS } from "@/constants/nav-items";
import { DangerZoneTabContainer } from "@/containers/admin-dashboard/settings/danger-zone-tab-container";

export const metadata: Metadata = { title: "Settings — Danger Zone | Admin" };

export default function AdminSettingsDangerZonePage() {
  return (
    <SettingsShell navItems={ADMIN_SETTINGS_NAV_ITEMS}>
      <DangerZoneTabContainer />
    </SettingsShell>
  );
}
