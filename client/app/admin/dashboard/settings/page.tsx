import { redirect } from "next/navigation";
import { NavRoute } from "@/enums/nav-route.enum";

/**
 * Admin settings hub — redirects to the Platform tab. Tabbed content now
 * lives under /admin/dashboard/settings/{platform,business-rules,danger-zone}.
 */
export default function AdminSettingsPage() {
  redirect(NavRoute.AdminSettingsPlatform);
}
