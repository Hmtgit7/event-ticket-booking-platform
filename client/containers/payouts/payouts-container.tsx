"use client";

import { useEffect, useState } from "react";
import { PayoutAccountCard } from "@/components/dashboard/payouts/payout-account-card";
import { RequestPayoutCard } from "@/components/dashboard/payouts/request-payout-card";
import { PayoutHistoryList } from "@/components/dashboard/payouts/payout-history-list";
import { Skeleton } from "@/components/ui/skeleton";
import { payoutService } from "@/services/payout.service";
import { payoutAccountService } from "@/services/payout-account.service";
import type { AvailableBalanceResponse, PayoutRequestResponse } from "@/interfaces/payout-api.interface";
import type { PayoutAccountResponse } from "@/interfaces/payout-account-api.interface";

/**
 * Organizer's Payouts page - three pieces backed by two different services:
 * available balance + payout requests (booking-service), payout account
 * setup (payment-service). Loaded together on mount since the page reads
 * as one screen even though it's two backends underneath.
 */
export function PayoutsContainer() {
  const [balance, setBalance] = useState<AvailableBalanceResponse | null>(null);
  const [account, setAccount] = useState<PayoutAccountResponse | null>(null);
  const [requests, setRequests] = useState<PayoutRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      payoutService.getAvailableBalance(),
      payoutAccountService.getMyPayoutAccount(),
      payoutService.getMyPayoutRequests(0, 10),
    ])
      .then(([balanceResult, accountResult, requestsResult]) => {
        if (cancelled) return;
        setBalance(balanceResult);
        setAccount(accountResult);
        setRequests(requestsResult.items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleAccountSaved(updated: PayoutAccountResponse) {
    setAccount(updated);
  }

  function handleRequested(request: PayoutRequestResponse) {
    setRequests((prev) => [request, ...prev]);
    payoutService.getAvailableBalance().then(setBalance);
  }

  if (loading || !balance) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <PayoutAccountCard account={account} onSaved={handleAccountSaved} />
        <RequestPayoutCard balance={balance} payoutAccountActive={account?.status === "ACTIVE"} onRequested={handleRequested} />
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">History</p>
        <h2 className="mb-4 mt-1 text-lg font-bold text-ink">Payout requests</h2>
        <PayoutHistoryList requests={requests} />
      </div>
    </div>
  );
}
