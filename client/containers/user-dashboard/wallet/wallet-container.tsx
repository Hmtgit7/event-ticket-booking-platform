"use client";

import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { WalletBalanceCard } from "@/components/user-dashboard/wallet/wallet-balance-card";
import { TransactionRow } from "@/components/user-dashboard/wallet/transaction-row";
import { DUMMY_WALLET } from "@/constants/user-dashboard-data";

/**
 * Wallet page container — balance hero card + recent transaction history.
 */
export function WalletContainer() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 md:grid-cols-[0.85fr_1fr]">
        <WalletBalanceCard balance="$17.00" cardLast4="4821" />

        {/* ── Quick stats ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Total spent (this year)", value: "$318" },
            { label: "Pending refunds",         value: "$5"   },
            { label: "Promo credits",            value: "$12"  },
            { label: "Tickets purchased",        value: "12"   },
          ].map(({ label, value }) => (
            <article key={label} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-xs text-ink-muted">{label}</p>
              <p className="mt-2 text-2xl font-black text-ink">{value}</p>
            </article>
          ))}
        </div>
      </div>

      {/* ── Transaction list ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <SectionTitle eyebrow="Payments" title="Recent wallet activity" />
        <div className="mt-4 flex flex-col gap-3">
          {DUMMY_WALLET.map((txn) => (
            <TransactionRow key={txn.id} transaction={txn} />
          ))}
        </div>
      </div>
    </div>
  );
}
