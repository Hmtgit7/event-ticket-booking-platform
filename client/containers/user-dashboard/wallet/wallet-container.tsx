"use client";

import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { WalletBalanceCard } from "@/components/user-dashboard/wallet/wallet-balance-card";
import { TransactionRow } from "@/components/user-dashboard/wallet/transaction-row";
import { RechargeWalletModal } from "@/components/user-dashboard/wallet/recharge-wallet-modal";
import { walletService } from "@/services/wallet.service";
import type { WalletResponse, WalletTransactionResponse } from "@/interfaces/wallet-api.interface";

/**
 * Wallet page container — balance hero card + recent transaction history,
 * both backed by booking-service. "Add funds" is a dummy recharge until a
 * real payment gateway lands (see RechargeWalletModal).
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
    setLoading(true);
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
      <p className="rounded-2xl border border-line bg-surface px-5 py-12 text-center text-sm text-ink-muted">
        Loading wallet…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <WalletBalanceCard balance={`$${(wallet?.balance ?? 0).toFixed(2)}`} onAddFunds={() => setModalOpen(true)} />

      <div className="rounded-2xl border border-line bg-surface p-5">
        <SectionTitle eyebrow="Payments" title="Recent wallet activity" />
        <div className="mt-4 flex flex-col gap-3">
          {transactions.length === 0 ? (
            <p className="rounded-xl border border-line bg-background px-4 py-8 text-center text-sm text-ink-muted">
              No transactions yet — add funds to get started.
            </p>
          ) : (
            transactions.map((txn) => <TransactionRow key={txn.id} transaction={txn} />)
          )}
        </div>
      </div>

      <RechargeWalletModal open={modalOpen} onClose={() => setModalOpen(false)} onRecharged={handleRecharged} />
    </div>
  );
}
