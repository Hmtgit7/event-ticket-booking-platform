import { GenericContentSkeleton } from "@/components/skeleton";

/**
 * Fallback for /dashboard/* pages without a more specific loading.tsx.
 * `layout.tsx` (DashboardShell/sidebar) isn't suspended by this — it mounts
 * immediately, only the content slot shows this while the target page's JS
 * loads and takes over.
 */
export default function DashboardLoading() {
  return <GenericContentSkeleton />;
}
