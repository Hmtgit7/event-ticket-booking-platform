import type { Metadata } from "next";
import { SettingsShell } from "@/components/settings/settings-shell";
import { ORGANIZER_SETTINGS_NAV_ITEMS } from "@/constants/nav-items";
import { SecurityTabContainer } from "@/containers/dashboard-settings/security-tab-container";

export const metadata: Metadata = { title: "Settings — Security" };

export default function OrganizerSettingsSecurityPage() {
  return (
    <SettingsShell navItems={ORGANIZER_SETTINGS_NAV_ITEMS}>
      <SecurityTabContainer />
    </SettingsShell>
  );
}
