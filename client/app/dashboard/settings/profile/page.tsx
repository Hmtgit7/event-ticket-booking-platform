import type { Metadata } from "next";
import { SettingsShell } from "@/components/settings/settings-shell";
import { ORGANIZER_SETTINGS_NAV_ITEMS } from "@/constants/nav-items";
import { ProfileTabContainer } from "@/containers/dashboard-settings/profile-tab-container";

export const metadata: Metadata = { title: "Settings — Profile" };

export default function OrganizerSettingsProfilePage() {
  return (
    <SettingsShell navItems={ORGANIZER_SETTINGS_NAV_ITEMS}>
      <ProfileTabContainer />
    </SettingsShell>
  );
}
