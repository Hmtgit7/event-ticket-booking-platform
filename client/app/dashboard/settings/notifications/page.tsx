import type { Metadata } from "next";
import { SettingsShell } from "@/components/settings/settings-shell";
import { ORGANIZER_SETTINGS_NAV_ITEMS } from "@/constants/nav-items";
import { NotificationsTabContainer } from "@/containers/dashboard-settings/notifications-tab-container";

export const metadata: Metadata = { title: "Settings — Notifications" };

export default function OrganizerSettingsNotificationsPage() {
  return (
    <SettingsShell navItems={ORGANIZER_SETTINGS_NAV_ITEMS}>
      <NotificationsTabContainer />
    </SettingsShell>
  );
}
