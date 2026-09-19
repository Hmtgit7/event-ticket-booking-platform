import type { Metadata } from "next";
import { SettingsShell } from "@/components/settings/settings-shell";
import { USER_SETTINGS_NAV_ITEMS } from "@/constants/nav-items";
import { NotificationsTabContainer } from "@/containers/user-dashboard/settings/notifications-tab-container";

export const metadata: Metadata = { title: "Profile — Notifications" };

export default function UserProfileNotificationsPage() {
  return (
    <SettingsShell navItems={USER_SETTINGS_NAV_ITEMS}>
      <NotificationsTabContainer />
    </SettingsShell>
  );
}
