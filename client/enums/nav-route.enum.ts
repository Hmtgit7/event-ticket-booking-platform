/**
 * Canonical dashboard route paths. Kept as a const object (not `enum`)
 * so values are erasable, tree-shakable, and usable directly as string
 * literal types — friendlier to `isolatedModules` + the app router.
 */
export const NavRoute = {
  Dashboard: "/dashboard",
  Events: "/dashboard/events",
  AttendeeInsights: "/dashboard/insights",
  Settings: "/dashboard/settings",
  Help: "/dashboard/help",
} as const;

export type NavRoute = (typeof NavRoute)[keyof typeof NavRoute];
