"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { walletService } from "@/services/wallet.service";
import type { WalletResponse } from "@/interfaces/wallet-api.interface";

interface RechargeWalletModalProps {
  open: boolean;
  onClose: () => void;
  onRecharged: (wallet: WalletResponse) => void;
}

/**
 * "Add funds" modal - dummy recharge for now (no real payment gateway),
 * same portal/Escape/backdrop pattern as ConfirmDialog. Any positive amount
 * is accepted; the note below the input is the whole point of this being
 * a placeholder until Razorpay lands.
 */
export function RechargeWalletModal({ open, onClose, onRecharged }: RechargeWalletModalProps) {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setAmount("");
    setError(null);
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setError("Enter an amount greater than 0");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const wallet = await walletService.recharge({ amount: parsed });
      onRecharged(wallet);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't add funds. Please try again." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="recharge-modal-title" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <form onSubmit={handleSubmit} className="relative w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl">
        <h2 id="recharge-modal-title" className="text-lg font-bold text-ink">Add funds to wallet</h2>
        <p className="mt-1 text-sm text-ink-muted">Enter the amount you&apos;d like to add.</p>

        <label className="mt-4 block text-xs font-semibold text-ink-muted" htmlFor="recharge-amount">
          Amount
        </label>
        <Input
          id="recharge-amount"
          type="number"
          min="1"
          step="0.01"
          placeholder="e.g. 500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
          className="mt-1"
        />
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

        <p className="mt-4 rounded-xl border border-line bg-background px-3 py-2.5 text-xs text-ink-muted">
          Payment integration coming soon — this adds the amount directly for now.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Adding…" : "Add funds"}
          </Button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
