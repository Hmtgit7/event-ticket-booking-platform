"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { useCurrentUser } from "@/modules/auth/hooks/use-current-user";
import { useDeletionEligibility } from "@/modules/auth/hooks/use-deletion-eligibility";
import { useRequestAccountDeletion } from "@/modules/auth/hooks/use-request-account-deletion";
import { useLogout } from "@/modules/auth/hooks/use-logout";
import type { DeletionBlocker, DeletionScope } from "@/interfaces/account-deletion.interface";

interface AccountDeletionModalProps {
  open: boolean;
  onClose: () => void;
  scope: DeletionScope;
  /** e.g. "Delete customer profile" / "Delete account" - shown as the modal title and used in a couple of copy spots. */
  title: string;
}

const CONFIRM_PHRASE = "delete";

function BlockerList({ items, tone }: { items: DeletionBlocker[]; tone: "blocker" | "warning" }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.code}
          className={
            tone === "blocker"
              ? "rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
              : "rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-sm text-amber-700"
          }
        >
          {item.message}
        </li>
      ))}
    </ul>
  );
}

/**
 * Portal-based confirmation flow, same structural pattern as
 * RechargeWalletModal - fetches eligibility only once opened, then walks
 * through: blocked (hard stop) -> warnings (needs explicit consent) ->
 * confirm (password + typed phrase) -> success (logs out, since
 * requestDeletion revokes every refresh token immediately).
 */
export function AccountDeletionModal({ open, onClose, scope, title }: AccountDeletionModalProps) {
  const [mounted, setMounted] = useState(false);
  const { data: user } = useCurrentUser();
  const eligibility = useDeletionEligibility(scope, open);
  const requestDeletion = useRequestAccountDeletion();
  const logout = useLogout();

  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = useCallback(() => {
    setCurrentPassword("");
    setConfirmPhrase("");
    setAcknowledgeWarnings(false);
    setSubmitted(false);
    requestDeletion.reset();
    onClose();
  }, [onClose, requestDeletion]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleClose, open]);

  if (!open || !mounted || !user) return null;

  const hasPassword = user.hasPassword;
  // A 409 on submit carries the same structured body a direct eligibility
  // check would - merge it in so a blocker that appeared mid-flow (e.g. a
  // booking placed in another tab) renders the same way a stale GET would.
  const blockers = requestDeletion.eligibilityFromError?.blockers ?? eligibility.data?.blockers ?? [];
  const warnings = requestDeletion.eligibilityFromError?.warnings ?? eligibility.data?.warnings ?? [];
  const hasBlockers = blockers.length > 0;
  const needsWarningConsent = warnings.length > 0 && !acknowledgeWarnings;
  const confirmPhraseMatches = confirmPhrase.trim().toLowerCase() === CONFIRM_PHRASE;
  const canSubmit =
    !hasBlockers &&
    !needsWarningConsent &&
    confirmPhraseMatches &&
    (!hasPassword || currentPassword.length > 0);

  async function handleSubmit() {
    try {
      await requestDeletion.submit({
        scope,
        currentPassword: hasPassword ? currentPassword : undefined,
        acknowledgeWarnings: warnings.length > 0,
      });
      setSubmitted(true);
    } catch {
      // Surfaced via requestDeletion.errorMessage / eligibilityFromError below - nothing else to do here.
    }
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-deletion-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={submitted ? undefined : handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
        {submitted ? (
          <>
            <h2 id="account-deletion-modal-title" className="text-lg font-bold text-ink">
              Deletion scheduled
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              You&apos;ll be logged out now. You can cancel this any time before the grace period ends by logging
              back in.
            </p>
            <div className="mt-6 flex justify-end">
              <Button type="button" onClick={logout}>
                OK
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
              <h2 id="account-deletion-modal-title" className="text-lg font-bold text-ink">
                {title}
              </h2>
            </div>

            {eligibility.isLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                Checking what&apos;s still pending…
              </div>
            ) : eligibility.isError && !hasBlockers ? (
              <p className="mt-4 text-sm text-destructive">
                Couldn&apos;t check eligibility right now. Please try again in a moment.
              </p>
            ) : hasBlockers ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-ink-muted">
                  This can&apos;t be deleted yet - resolve the following first:
                </p>
                <BlockerList items={blockers} tone="blocker" />
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-ink-muted">This can&apos;t be undone once the grace period ends.</p>

                {warnings.length > 0 ? (
                  <div className="space-y-2">
                    <BlockerList items={warnings} tone="warning" />
                    <label className="flex items-start gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={acknowledgeWarnings}
                        onChange={(e) => setAcknowledgeWarnings(e.target.checked)}
                        className="mt-0.5 size-4 rounded border-line"
                      />
                      I understand and accept this
                    </label>
                  </div>
                ) : null}

                <AuthErrorBanner message={!hasBlockers ? requestDeletion.errorMessage : null} />

                {hasPassword ? (
                  <AuthInput
                    id="deletion-current-password"
                    label="Confirm your password"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    disabled={requestDeletion.isPending}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                ) : null}

                <AuthInput
                  id="deletion-confirm-phrase"
                  label={`Type "${CONFIRM_PHRASE}" to confirm`}
                  type="text"
                  value={confirmPhrase}
                  disabled={requestDeletion.isPending}
                  onChange={(e) => setConfirmPhrase(e.target.value)}
                  autoComplete="off"
                />

                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={requestDeletion.isPending}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={!canSubmit || requestDeletion.isPending}
                    onClick={handleSubmit}
                  >
                    {requestDeletion.isPending ? (
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                    ) : null}
                    {title}
                  </Button>
                </div>
              </div>
            )}

            {hasBlockers ? (
              <div className="mt-6 flex justify-end">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
