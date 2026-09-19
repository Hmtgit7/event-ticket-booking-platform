/**
 * Canonical dashboard route paths. Kept as a const object (not `enum`)
 * so values are erasable, tree-shakable, and usable directly as string
 * literal types — friendlier to `isolatedModules` + the app router.
 */
export const NavRoute = {
  // Organizer dashboard
  Dashboard: "/dashboard",
  Events: "/dashboard/events",
  CreateEvent: "/dashboard/events/create",
  AttendeeInsights: "/dashboard/insights",
  Media: "/dashboard/media",
  Revenue: "/dashboard/revenue",
  Payouts: "/dashboard/payouts",
  Promotions: "/dashboard/promotions",
  Notifications: "/dashboard/notifications",
  Settings: "/dashboard/settings",
  SettingsProfile: "/dashboard/settings/profile",
  SettingsPreferences: "/dashboard/settings/preferences",
  SettingsNotifications: "/dashboard/settings/notifications",
  SettingsSecurity: "/dashboard/settings/security",
  Help: "/dashboard/help",

  // User dashboard
  UserDashboard: "/user/dashboard",
  UserExplore: "/user/dashboard/explore",
  UserOrders: "/user/dashboard/orders",
  UserSaved: "/user/dashboard/saved",
  UserWallet: "/user/dashboard/wallet",
  UserProfile: "/user/dashboard/profile",
  UserProfilePreferences: "/user/dashboard/profile/preferences",
  UserProfileNotifications: "/user/dashboard/profile/notifications",
  UserProfileSecurity: "/user/dashboard/profile/security",
  UserSupport: "/user/dashboard/support",
  UserNotifications: "/user/dashboard/notifications",

  // Admin dashboard
  AdminDashboard: "/admin/dashboard",
  AdminUsers: "/admin/dashboard/users",
  AdminApprovals: "/admin/dashboard/approvals",
  AdminEvents: "/admin/dashboard/events",
  AdminBookings: "/admin/dashboard/bookings",
  AdminReports: "/admin/dashboard/reports",
  AdminSettings: "/admin/dashboard/settings",
  AdminSupport: "/admin/dashboard/support",
  AdminNotifications: "/admin/dashboard/notifications",
} as const;

export type NavRoute = (typeof NavRoute)[keyof typeof NavRoute];
