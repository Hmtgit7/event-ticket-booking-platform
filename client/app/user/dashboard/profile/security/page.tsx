import type { Metadata } from "next";
import { SettingsShell } from "@/components/settings/settings-shell";
import { USER_SETTINGS_NAV_ITEMS } from "@/constants/nav-items";
import { SecurityTabContainer } from "@/containers/user-dashboard/settings/security-tab-container";

export const metadata: Metadata = { title: "Profile — Security" };

export default function UserProfileSecurityPage() {
  return (
    <SettingsShell navItems={USER_SETTINGS_NAV_ITEMS}>
      <SecurityTabContainer />
    </SettingsShell>
  );
}
