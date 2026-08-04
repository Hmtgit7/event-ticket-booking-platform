import { cn } from "@/lib/utils";
import type { WalletTransaction } from "@/constants/user-dashboard-data";

interface TransactionRowProps {
  transaction: WalletTransaction;
}

/**
 * A single row in the wallet activity list.
 */
export function TransactionRow({ transaction }: TransactionRowProps) {
  const isCredit = transaction.type === "credit";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-background px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{transaction.label}</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {transaction.date} · {transaction.status}
        </p>
      </div>
      <p
        className={cn(
          "shrink-0 text-sm font-black",
          isCredit ? "text-positive" : "text-ink",
        )}
      >
        {transaction.amount}
      </p>
    </div>
  );
}
