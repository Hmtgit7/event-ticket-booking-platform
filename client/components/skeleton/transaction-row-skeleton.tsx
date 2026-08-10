import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for `TransactionRow` (wallet activity list). */
export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-background px-4 py-3">
      <div className="min-w-0 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-4 w-16 shrink-0" />
    </div>
  );
}

export function TransactionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <TransactionRowSkeleton key={index} />
      ))}
    </div>
  );
}

/** Placeholder for `WalletBalanceCard`. */
export function WalletBalanceCardSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="flex items-center justify-end">
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}
