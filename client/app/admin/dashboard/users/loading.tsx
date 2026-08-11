import { TableListSkeleton } from "@/components/skeleton";

export default function AdminUsersLoading() {
  return <TableListSkeleton rows={6} columns={5} />;
}
