import type { Metadata } from "next";
import { SettingsShell } from "@/components/settings/settings-shell";
import { ADMIN_SETTINGS_NAV_ITEMS } from "@/constants/nav-items";
import { PlatformTabContainer } from "@/containers/admin-dashboard/settings/platform-tab-container";

export const metadata: Metadata = { title: "Settings — Platform | Admin" };

export default function AdminSettingsPlatformPage() {
  return (
    <SettingsShell navItems={ADMIN_SETTINGS_NAV_ITEMS}>
      <PlatformTabContainer />
    </SettingsShell>
  );
}
