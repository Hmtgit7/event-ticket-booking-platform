import {
  Home01FreeIcons,
  Calendar03FreeIcons,
  Analytics01FreeIcons,
  Settings01FreeIcons,
  HelpCircleFreeIcons,
} from "@hugeicons/core-free-icons";
import { NavRoute } from "@/enums/nav-route.enum";
import type { NavSection } from "@/interfaces/nav.interface";

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Menu",
    items: [
      { id: "dashboard", label: "Dashboard", href: NavRoute.Dashboard, icon: Home01FreeIcons },
      { id: "events", label: "Events", href: NavRoute.Events, icon: Calendar03FreeIcons, matchPrefix: true },
      { id: "insights", label: "Attendee Insights", href: NavRoute.AttendeeInsights, icon: Analytics01FreeIcons, matchPrefix: true },
    ],
  },
  {
    title: "General",
    items: [
      { id: "settings", label: "Settings", href: NavRoute.Settings, icon: Settings01FreeIcons },
      { id: "help", label: "Help", href: NavRoute.Help, icon: HelpCircleFreeIcons },
    ],
  },
];
