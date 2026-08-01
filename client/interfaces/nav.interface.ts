import type { NavRoute } from "@/enums/nav-route.enum";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HugeIcon = any;

export interface NavItem {
  id: string;
  label: string;
  href: NavRoute;
  icon: HugeIcon;
  /** Match sub-routes (e.g. /dashboard/events/123) as active too. */
  matchPrefix?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
