import type { Metadata } from "next";
import { SettingsShell } from "@/components/settings/settings-shell";
import { ADMIN_SETTINGS_NAV_ITEMS } from "@/constants/nav-items";
import { BusinessRulesTabContainer } from "@/containers/admin-dashboard/settings/business-rules-tab-container";

export const metadata: Metadata = { title: "Settings — Business Rules | Admin" };

export default function AdminSettingsBusinessRulesPage() {
  return (
    <SettingsShell navItems={ADMIN_SETTINGS_NAV_ITEMS}>
      <BusinessRulesTabContainer />
    </SettingsShell>
  );
}
