import type { Metadata } from "next";
import { SettingsShell } from "@/components/settings/settings-shell";
import { USER_SETTINGS_NAV_ITEMS } from "@/constants/nav-items";
import { PreferencesTabContainer } from "@/containers/user-dashboard/settings/preferences-tab-container";

export const metadata: Metadata = { title: "Profile — Preferences" };

export default function UserProfilePreferencesPage() {
  return (
    <SettingsShell navItems={USER_SETTINGS_NAV_ITEMS}>
      <PreferencesTabContainer />
    </SettingsShell>
  );
}
