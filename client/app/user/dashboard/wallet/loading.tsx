import { WalletBalanceCardSkeleton, TransactionListSkeleton } from "@/components/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function WalletLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
        <WalletBalanceCardSkeleton />
        {Array.from({ length: 3 }, (_, index) => (
          <article key={index} className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
          </article>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5">
        <Skeleton className="h-5 w-40" />
        <div className="mt-4">
          <TransactionListSkeleton count={5} />
        </div>
      </div>
    </div>
  );
}
