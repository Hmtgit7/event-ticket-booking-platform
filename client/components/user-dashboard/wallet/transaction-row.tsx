import { cn } from "@/lib/utils";
import type { WalletTransactionResponse } from "@/interfaces/wallet-api.interface";

interface TransactionRowProps {
  transaction: WalletTransactionResponse;
}

const STATUS_LABEL: Record<WalletTransactionResponse["status"], string> = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  FAILED: "Failed",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
}

/**
 * A single row in the wallet activity list.
 */
export function TransactionRow({ transaction }: TransactionRowProps) {
  const isCredit = transaction.type === "CREDIT";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-background px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{transaction.description}</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {formatDate(transaction.createdAt)} · {STATUS_LABEL[transaction.status]}
        </p>
      </div>
      <p className={cn("shrink-0 text-sm font-black", isCredit ? "text-positive" : "text-ink")}>
        {isCredit ? "+" : "-"}${transaction.amount.toFixed(2)}
      </p>
    </div>
  );
}
