import { TableListSkeleton } from "@/components/skeleton";

export default function AdminBookingsLoading() {
  return <TableListSkeleton rows={6} columns={5} />;
}
