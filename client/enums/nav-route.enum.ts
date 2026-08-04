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
  Promotions: "/dashboard/promotions",
  Notifications: "/dashboard/notifications",
  Settings: "/dashboard/settings",
  Help: "/dashboard/help",

  // User dashboard
  UserDashboard: "/user/dashboard",
  UserExplore: "/user/dashboard/explore",
  UserOrders: "/user/dashboard/orders",
  UserSaved: "/user/dashboard/saved",
  UserWallet: "/user/dashboard/wallet",
  UserProfile: "/user/dashboard/profile",
  UserSupport: "/user/dashboard/support",

  // Admin dashboard
  AdminDashboard: "/admin/dashboard",
  AdminUsers: "/admin/dashboard/users",
  AdminEvents: "/admin/dashboard/events",
  AdminBookings: "/admin/dashboard/bookings",
  AdminReports: "/admin/dashboard/reports",
  AdminSettings: "/admin/dashboard/settings",
  AdminSupport: "/admin/dashboard/support",
} as const;

export type NavRoute = (typeof NavRoute)[keyof typeof NavRoute];
