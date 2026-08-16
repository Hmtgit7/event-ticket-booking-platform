"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PayoutStatusBadge } from "@/components/dashboard/payouts/payout-status-badge";
import { ApiError } from "@/lib/api-client";
import { payoutAccountService } from "@/services/payout-account.service";
import type { PayoutAccountResponse } from "@/interfaces/payout-account-api.interface";

const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;

interface PayoutAccountCardProps {
  account: PayoutAccountResponse | null;
  onSaved: (account: PayoutAccountResponse) => void;
}

/**
 * Bank-account-only for now (no UPI) - see product decision in the payout
 * planning discussion. Once ACTIVE this deliberately shows no edit control:
 * changing payout bank details is admin-mediated, not self-service (matches
 * payment-service's PayoutAccountService rejecting resubmission once
 * ACTIVE) - the UI shouldn't offer an action the backend will just reject.
 */
export function PayoutAccountCard({ account, onSaved }: PayoutAccountCardProps) {
  const [editing, setEditing] = useState(account === null);
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (bankAccountNumber !== confirmAccountNumber) {
      setError("Account numbers don't match");
      return;
    }
    if (!IFSC_PATTERN.test(ifscCode.toUpperCase())) {
      setError("Enter a valid IFSC code");
      return;
    }

    setSubmitting(true);
    try {
      const result = await payoutAccountService.submit({
        accountHolderName,
        bankAccountNumber,
        ifscCode: ifscCode.toUpperCase(),
      });
      onSaved(result);
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? "Couldn't save your payout account. Please check the details and try again." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!editing && account) {
    return (
      <article className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Payout account</p>
          <PayoutStatusBadge status={account.status} />
        </div>

        <p className="mt-3 text-lg font-bold text-ink">{account.accountHolderName}</p>
        <p className="text-sm text-ink-muted">Account ending in {account.bankAccountLast4} · {account.ifscCode}</p>

        {account.status === "ACTIVE" && (
          <p className="mt-4 text-xs text-ink-muted">
            To change your payout account, please contact support.
          </p>
        )}

        {account.status === "FAILED" && (
          <div className="mt-4">
            <p className="text-sm text-destructive">{account.failureReason ?? "Verification failed."}</p>
            <Button type="button" variant="outline" className="mt-3" onClick={() => setEditing(true)}>
              Try again
            </Button>
          </div>
        )}
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">Payout account</p>
      <h2 className="mt-1 text-lg font-bold text-ink">Add your bank account</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Sent directly to Razorpay for verification — GrabMyTicket never stores your full account number.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <Field label="Account holder name">
          <Input value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} required disabled={submitting} />
        </Field>
        <Field label="Bank account number">
          <Input
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            required
            disabled={submitting}
          />
        </Field>
        <Field label="Confirm account number">
          <Input
            value={confirmAccountNumber}
            onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            required
            disabled={submitting}
          />
        </Field>
        <Field label="IFSC code">
          <Input
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
            placeholder="e.g. HDFC0001234"
            required
            disabled={submitting}
          />
        </Field>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          {account && (
            <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={submitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Verifying…" : "Save payout account"}
          </Button>
        </div>
      </form>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-ink-muted">{label}</span>
      {children}
    </label>
  );
}
