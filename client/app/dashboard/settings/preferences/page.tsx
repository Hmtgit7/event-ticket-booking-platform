import type { Metadata } from "next";
import { SettingsShell } from "@/components/settings/settings-shell";
import { ORGANIZER_SETTINGS_NAV_ITEMS } from "@/constants/nav-items";
import { PreferencesTabContainer } from "@/containers/dashboard-settings/preferences-tab-container";

export const metadata: Metadata = { title: "Settings — Preferences" };

export default function OrganizerSettingsPreferencesPage() {
  return (
    <SettingsShell navItems={ORGANIZER_SETTINGS_NAV_ITEMS}>
      <PreferencesTabContainer />
    </SettingsShell>
  );
}
