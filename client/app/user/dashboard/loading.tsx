import { GenericContentSkeleton } from "@/components/skeleton";

/** Fallback for /user/dashboard/* pages without a more specific loading.tsx. */
export default function UserDashboardLoading() {
  return <GenericContentSkeleton />;
}
