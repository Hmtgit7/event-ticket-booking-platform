"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { paymentService } from "@/services/payment.service";
import { walletService } from "@/services/wallet.service";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import type { WalletResponse } from "@/interfaces/wallet-api.interface";

interface RechargeWalletModalProps {
  open: boolean;
  onClose: () => void;
  onRecharged: (wallet: WalletResponse) => void;
  /** Current balance, used as the baseline the post-payment poll watches for a change against. */
  currentBalance: number;
}

type Stage = "form" | "processing" | "awaiting-credit" | "timed-out";

// The webhook -> Kafka -> wallet-credit round trip is normally sub-second,
// but this polls generously (20s) to absorb Kafka/webhook delivery jitter
// without leaving the user staring at a spinner that gives up too early.
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 10;

/**
 * "Add funds" modal, backed by a real Razorpay order now (payment-service).
 * The wallet balance itself only updates once payment-service's webhook
 * confirms the payment and booking-service's Kafka consumer credits it -
 * so after Razorpay's checkout reports success, this polls GET /wallet for
 * a balance change rather than trusting the client-side callback directly.
 */
export function RechargeWalletModal({ open, onClose, onRecharged, currentBalance }: RechargeWalletModalProps) {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState<string | null>(null);
  const pollAttemptsRef = useRef(0);
  const { open: openCheckout } = useRazorpayCheckout();

  const handleClose = useCallback(() => {
    setAmount("");
    setError(null);
    setStage("form");
    pollAttemptsRef.current = 0;
    onClose();
  }, [onClose]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && stage !== "awaiting-credit") handleClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleClose, open, stage]);

  const pollForCredit = useCallback(() => {
    pollAttemptsRef.current = 0;
    const tick = () => {
      pollAttemptsRef.current += 1;
      walletService
        .getWallet()
        .then((wallet) => {
          if (wallet.balance > currentBalance) {
            onRecharged(wallet);
            handleClose();
            return;
          }
          if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
            setStage("timed-out");
            return;
          }
          setTimeout(tick, POLL_INTERVAL_MS);
        })
        .catch(() => {
          if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
            setStage("timed-out");
            return;
          }
          setTimeout(tick, POLL_INTERVAL_MS);
        });
    };
    tick();
  }, [currentBalance, handleClose, onRecharged]);

  if (!open || !mounted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setError("Enter an amount greater than 0");
      return;
    }

    setStage("processing");
    setError(null);
    try {
      const order = await paymentService.createOrder({ amount: parsed });
      await openCheckout({
        razorpayKeyId: order.razorpayKeyId,
        razorpayOrderId: order.razorpayOrderId,
        amount: order.amount,
        currency: order.currency,
        onSuccess: () => {
          setStage("awaiting-credit");
          pollForCredit();
        },
        onDismiss: () => {
          setStage("form");
        },
        onError: (message) => {
          setError(message);
          setStage("form");
        },
      });
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't start the payment. Please try again." : "Something went wrong.");
      setStage("form");
    }
  }

  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="recharge-modal-title" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={stage === "awaiting-credit" ? undefined : handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl">
        {stage === "awaiting-credit" ? (
          <>
            <h2 className="text-lg font-bold text-ink">Confirming your payment…</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Razorpay confirmed your payment. We&apos;re crediting your wallet now — this usually takes a few seconds.
            </p>
          </>
        ) : stage === "timed-out" ? (
          <>
            <h2 className="text-lg font-bold text-ink">Still processing</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Your payment went through, but it&apos;s taking longer than usual to reflect in your wallet. It&apos;ll update
              automatically — no need to pay again.
            </p>
            <div className="mt-6 flex justify-end">
              <Button type="button" onClick={handleClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 id="recharge-modal-title" className="text-lg font-bold text-ink">
              Add funds to wallet
            </h2>
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
              disabled={stage === "processing"}
              className="mt-1"
            />
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={stage === "processing"}>
                Cancel
              </Button>
              <Button type="submit" disabled={stage === "processing"}>
                {stage === "processing" ? "Opening payment…" : "Add funds"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
