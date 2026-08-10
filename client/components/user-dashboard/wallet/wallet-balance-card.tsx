import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WalletBalanceCardProps {
  balance: string;
  onAddFunds: () => void;
}

/**
 * Hero card for the Wallet page — shows available balance. "Add funds"
 * opens RechargeWalletModal (real payment integration coming later).
 */
export function WalletBalanceCard({ balance, onAddFunds }: WalletBalanceCardProps) {
  return (
    <article className="flex flex-col justify-between gap-6 rounded-2xl border border-line bg-surface p-6 text-ink shadow-sm">
      <div>
        <p className="text-sm font-medium text-ink-muted">Available balance</p>
        <p className="mt-2 text-4xl font-bold tracking-normal">{balance}</p>
      </div>

      <div className="flex items-center justify-end">
        <Button
          size="sm"
          onClick={onAddFunds}
          className="border border-brand bg-brand text-brand-foreground hover:bg-brand/90"
        >
          <Plus className="size-4" />
          Add funds
        </Button>
      </div>
    </article>
  );
}
