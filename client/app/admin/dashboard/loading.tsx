import { GenericContentSkeleton } from "@/components/skeleton";

/** Fallback for /admin/dashboard/* pages without a more specific loading.tsx. */
export default function AdminDashboardLoading() {
  return <GenericContentSkeleton />;
}
