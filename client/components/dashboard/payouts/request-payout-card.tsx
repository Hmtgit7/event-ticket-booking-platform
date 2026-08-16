"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { payoutService } from "@/services/payout.service";
import type { AvailableBalanceResponse, PayoutRequestResponse } from "@/interfaces/payout-api.interface";

interface RequestPayoutCardProps {
  balance: AvailableBalanceResponse;
  /** Gates the form - can't request a payout without a verified bank account on file. */
  payoutAccountActive: boolean;
  onRequested: (request: PayoutRequestResponse) => void;
}

export function RequestPayoutCard({ balance, payoutAccountActive, onRequested }: RequestPayoutCardProps) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setError("Enter an amount greater than 0");
      return;
    }
    if (parsed > balance.availableBalance) {
      setError(`Amount exceeds your available balance of ₹${balance.availableBalance.toFixed(2)}`);
      return;
    }

    setSubmitting(true);
    try {
      const request = await payoutService.requestPayout({ amount: parsed });
      onRequested(request);
      setAmount("");
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't submit your payout request. Please try again." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">Withdraw</p>
      <h2 className="mt-1 text-lg font-bold text-ink">Request a payout</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Available to withdraw: <span className="font-semibold text-ink">₹{balance.availableBalance.toFixed(2)}</span>
      </p>

      {!payoutAccountActive ? (
        <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-ink-muted">
          Add your payout account above before requesting a withdrawal.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <Input
            type="number"
            min="1"
            step="0.01"
            placeholder="Amount to withdraw"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={submitting}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting} className="self-end">
            {submitting ? "Submitting…" : "Request payout"}
          </Button>
        </form>
      )}
    </article>
  );
}
