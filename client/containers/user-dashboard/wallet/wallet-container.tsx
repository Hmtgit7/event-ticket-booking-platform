"use client";

import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { WalletBalanceCard } from "@/components/user-dashboard/wallet/wallet-balance-card";
import { TransactionRow } from "@/components/user-dashboard/wallet/transaction-row";
import { RechargeWalletModal } from "@/components/user-dashboard/wallet/recharge-wallet-modal";
import { WalletBalanceCardSkeleton, TransactionListSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { NoWalletActivityIllustration } from "@/icons/empty-state-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { walletService } from "@/services/wallet.service";
import type { WalletResponse, WalletTransactionResponse } from "@/interfaces/wallet-api.interface";

/**
 * Wallet page container — balance hero card + recent transaction history,
 * both backed by booking-service. "Add funds" opens a real Razorpay order
 * via payment-service; the balance itself only updates once the payment is
 * confirmed and credited over Kafka (see RechargeWalletModal).
 */
export function WalletContainer() {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [transactions, setTransactions] = useState<WalletTransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  function loadWallet() {
    return Promise.all([walletService.getWallet(), walletService.getTransactions(0, 20)]).then(
      ([walletResult, transactionsResult]) => {
        setWallet(walletResult);
        setTransactions(transactionsResult.items);
      },
    );
  }

  useEffect(() => {
    let cancelled = false;
    loadWallet().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleRecharged(updatedWallet: WalletResponse) {
    setWallet(updatedWallet);
    walletService.getTransactions(0, 20).then((result) => setTransactions(result.items));
  }

  if (loading) {
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

  const completed = transactions.filter((txn) => txn.status === "COMPLETED");
  const expenseTotal = completed
    .filter((txn) => txn.type === "DEBIT")
    .reduce((sum, txn) => sum + txn.amount, 0);
  const addedTotal = completed
    .filter((txn) => txn.type === "CREDIT")
    .reduce((sum, txn) => sum + txn.amount, 0);
  const latestBalance = completed[0]?.balanceAfter ?? wallet?.balance ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
        <WalletBalanceCard balance={`$${(wallet?.balance ?? 0).toFixed(2)}`} onAddFunds={() => setModalOpen(true)} />
        <WalletMetric label="Wallet amount" value={`$${latestBalance.toFixed(2)}`} />
        <WalletMetric label="Expenses" value={`$${expenseTotal.toFixed(2)}`} tone="expense" />
        <WalletMetric label="Added funds" value={`$${addedTotal.toFixed(2)}`} tone="positive" />
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <SectionTitle eyebrow="Payments" title="Recent wallet activity" />
        <div className="mt-4 flex flex-col gap-3">
          {transactions.length === 0 ? (
            <EmptyState
              icon={<NoWalletActivityIllustration className="size-28" />}
              title="No transactions yet"
              description="Add funds to get started."
              action={{ label: "Add funds", onClick: () => setModalOpen(true) }}
            />
          ) : (
            transactions.map((txn) => <TransactionRow key={txn.id} transaction={txn} />)
          )}
        </div>
      </div>

      <RechargeWalletModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRecharged={handleRecharged}
        currentBalance={wallet?.balance ?? 0}
      />
    </div>
  );
}

function WalletMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "expense" | "positive";
}) {
  const toneClass = tone === "expense" ? "text-brand" : tone === "positive" ? "text-positive" : "text-ink";

  return (
    <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className={`mt-3 text-2xl font-bold ${toneClass}`}>{value}</p>
    </article>
  );
}
