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
    <article className="flex flex-col justify-between gap-6 rounded-2xl bg-ink p-6 text-background">
      <div>
        <p className="text-sm text-background/60">Available balance</p>
        <p className="mt-2 text-5xl font-black">{balance}</p>
      </div>

      <div className="flex items-center justify-end">
        <Button
          size="sm"
          onClick={onAddFunds}
          className="bg-background/15 text-background hover:bg-background/25 border border-background/20"
        >
          <Plus className="size-4" />
          Add funds
        </Button>
      </div>
    </article>
  );
}
