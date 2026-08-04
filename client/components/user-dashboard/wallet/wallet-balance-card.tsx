import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WalletBalanceCardProps {
  balance: string;
  cardLast4: string;
}

/**
 * Hero card for the Wallet page — shows available balance and default
 * payment method. The "Add funds" CTA is decorative in this dummy build.
 */
export function WalletBalanceCard({ balance, cardLast4 }: WalletBalanceCardProps) {
  return (
    <article className="flex flex-col justify-between gap-6 rounded-2xl bg-ink p-6 text-background">
      <div>
        <p className="text-sm text-background/60">Available balance</p>
        <p className="mt-2 text-5xl font-black">{balance}</p>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-background/50 uppercase tracking-wide">Default card</p>
          <p className="mt-1 text-sm font-semibold">•••• •••• •••• {cardLast4}</p>
        </div>
        <Button
          size="sm"
          className="bg-background/15 text-background hover:bg-background/25 border border-background/20"
        >
          <Plus className="size-4" />
          Add funds
        </Button>
      </div>
    </article>
  );
}
