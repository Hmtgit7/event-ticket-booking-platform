import { Skeleton } from "@/components/ui/skeleton";

/**
 * Placeholder for admin table rows (`UserTableRow`, booking rows, etc).
 * Column count/widths are configurable since admin tables vary slightly,
 * but the shape (avatar + name/email + 2-3 badges) covers most of them.
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div
      className="grid items-center gap-4 rounded-xl border border-line bg-background px-4 py-3"
      style={{ gridTemplateColumns: `auto 1fr repeat(${Math.max(columns - 2, 1)}, auto)` }}
    >
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <div className="min-w-0 space-y-1.5">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
      {Array.from({ length: Math.max(columns - 2, 1) }, (_, index) => (
        <Skeleton key={index} className="h-6 w-16 rounded-lg" />
      ))}
    </div>
  );
}

export function TableListSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, index) => (
        <TableRowSkeleton key={index} columns={columns} />
      ))}
    </div>
  );
}
