import { redirect } from "next/navigation";
import { NavRoute } from "@/enums/nav-route.enum";

/**
 * Settings hub — redirects to the Profile tab. The tabbed content now
 * lives under /dashboard/settings/{profile,preferences,notifications,security}.
 */
export default function SettingsPage() {
  redirect(NavRoute.SettingsProfile);
}
