import {
  Home01FreeIcons,
  Calendar03FreeIcons,
  Analytics01FreeIcons,
  Settings01FreeIcons,
  HelpCircleFreeIcons,
  Ticket01FreeIcons,
  Search01FreeIcons,
  FavouriteSquareFreeIcons,
  WalletAdd01FreeIcons,
  UserCircleFreeIcons,
  UserMultiple02FreeIcons,
  BarChartFreeIcons,
  CustomerSupportFreeIcons,
  PlusSignCircleFreeIcons,
  CloudUploadFreeIcons,
  DollarSignFreeIcons,
  CouponPercentFreeIcons,
  Notification02FreeIcons,
} from "@hugeicons/core-free-icons";
import { NavRoute } from "@/enums/nav-route.enum";
import type { NavSection } from "@/interfaces/nav.interface";

/** Organizer dashboard nav */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Events",
    items: [
      { id: "dashboard",   label: "Overview",          href: NavRoute.Dashboard,          icon: Home01FreeIcons },
      { id: "events",      label: "My Events",          href: NavRoute.Events,             icon: Calendar03FreeIcons,    matchPrefix: true },
      { id: "create",      label: "Create Event",       href: NavRoute.CreateEvent,        icon: PlusSignCircleFreeIcons },
      { id: "insights",    label: "Attendee Insights",  href: NavRoute.AttendeeInsights,   icon: Analytics01FreeIcons,   matchPrefix: true },
    ],
  },
  {
    title: "Manage",
    items: [
      { id: "revenue",      label: "Revenue",           href: NavRoute.Revenue,            icon: DollarSignFreeIcons,    matchPrefix: true },
      { id: "promotions",   label: "Promotions",        href: NavRoute.Promotions,         icon: CouponPercentFreeIcons, matchPrefix: true },
      { id: "media",        label: "Media Library",     href: NavRoute.Media,              icon: CloudUploadFreeIcons,   matchPrefix: true },
      { id: "notifications",label: "Notifications",     href: NavRoute.Notifications,      icon: Notification02FreeIcons,matchPrefix: true },
    ],
  },
  {
    title: "General",
    items: [
      { id: "settings", label: "Settings", href: NavRoute.Settings, icon: Settings01FreeIcons },
      { id: "help",     label: "Help",     href: NavRoute.Help,     icon: HelpCircleFreeIcons },
    ],
  },
];

/** End-user dashboard nav */
export const USER_NAV_SECTIONS: NavSection[] = [
  {
    title: "My Tickets",
    items: [
      { id: "user-dashboard", label: "Overview", href: NavRoute.UserDashboard, icon: Home01FreeIcons },
      { id: "user-orders", label: "Order History", href: NavRoute.UserOrders, icon: Ticket01FreeIcons, matchPrefix: true },
      { id: "user-saved", label: "Saved Events", href: NavRoute.UserSaved, icon: FavouriteSquareFreeIcons, matchPrefix: true },
      { id: "user-wallet", label: "Wallet", href: NavRoute.UserWallet, icon: WalletAdd01FreeIcons, matchPrefix: true },
    ],
  },
  {
    title: "Discover",
    items: [
      { id: "user-explore", label: "Explore Events", href: NavRoute.UserExplore, icon: Search01FreeIcons, matchPrefix: true },
    ],
  },
  {
    title: "Account",
    items: [
      { id: "user-profile", label: "Profile", href: NavRoute.UserProfile, icon: UserCircleFreeIcons, matchPrefix: true },
      { id: "user-support", label: "Help & Support", href: NavRoute.UserSupport, icon: HelpCircleFreeIcons, matchPrefix: true },
    ],
  },
];

/** Super-admin dashboard nav */
export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    title: "Platform",
    items: [
      { id: "admin-dashboard", label: "Overview",   href: NavRoute.AdminDashboard, icon: Home01FreeIcons },
      { id: "admin-events",    label: "Events",     href: NavRoute.AdminEvents,    icon: Calendar03FreeIcons,       matchPrefix: true },
      { id: "admin-bookings",  label: "Bookings",   href: NavRoute.AdminBookings,  icon: Ticket01FreeIcons,         matchPrefix: true },
      { id: "admin-reports",   label: "Reports",    href: NavRoute.AdminReports,   icon: BarChartFreeIcons,         matchPrefix: true },
    ],
  },
  {
    title: "Management",
    items: [
      { id: "admin-users",     label: "Users",      href: NavRoute.AdminUsers,     icon: UserMultiple02FreeIcons,   matchPrefix: true },
      { id: "admin-support",   label: "Support",    href: NavRoute.AdminSupport,   icon: CustomerSupportFreeIcons,  matchPrefix: true },
    ],
  },
  {
    title: "System",
    items: [
      { id: "admin-settings",  label: "Settings",   href: NavRoute.AdminSettings,  icon: Settings01FreeIcons,       matchPrefix: true },
    ],
  },
];
