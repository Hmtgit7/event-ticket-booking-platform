"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { InfoTooltip } from "@/components/auth/info-tooltip";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { useGoogleAuth } from "@/modules/auth/hooks/use-google-auth";
import { useBecomeOrganizer } from "@/modules/auth/hooks/use-become-organizer";
import { useDismissRolePrompt } from "@/modules/auth/hooks/use-dismiss-role-prompt";
import { resolvePostLoginRedirect } from "@/modules/auth/utils/post-login-redirect";
import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/enums/role.enum";
import { AuthLayout } from "@/layouts/AuthLayout";

/**
 * NextAuth lands here after Google's handshake completes. We exchange the
 * Google ID token for our own AuthResponse, then - if this account isn't an
 * organizer/admin yet AND hasn't been asked before (rolePromptSeen) - offer
 * the same "also host events" switch the signup form has, since the Google
 * flow has no other point where that intent can be captured. Once answered
 * either way, rolePromptSeen is persisted so it never asks again.
 */
export function OAuthBridgePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { exchangeGoogleToken, isPending, isError, errorMessage } = useGoogleAuth();
  const { becomeOrganizer, isPending: isUpgrading } = useBecomeOrganizer();
  const { dismiss: dismissRolePrompt } = useDismissRolePrompt();
  const user = useAuthStore((state) => state.user);
  const hasStarted = useRef(false);
  const [wantsToOrganize, setWantsToOrganize] = useState(false);
  const [showOrganizerPrompt, setShowOrganizerPrompt] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.googleIdToken && !hasStarted.current) {
      hasStarted.current = true;
      exchangeGoogleToken(session.googleIdToken, {
        onSuccess: (auth) => {
          const alreadyElevated = auth.roles.includes(Role.Organizer) || auth.roles.includes(Role.Admin);
          if (alreadyElevated || auth.rolePromptSeen) {
            router.push(resolvePostLoginRedirect(auth.roles));
          } else {
            setShowOrganizerPrompt(true);
          }
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  function continueFromPrompt() {
    if (wantsToOrganize) {
      // becomeOrganizer marks rolePromptSeen server-side too - answering "yes" is itself an answer.
      becomeOrganizer();
    } else {
      dismissRolePrompt();
      router.push("/user/dashboard");
    }
  }

  if (showOrganizerPrompt) {
    return (
      <AuthLayout>
        <div className="w-full max-w-[420px] space-y-5 text-center">
          <h1 className="text-2xl font-semibold text-ink">Welcome, {user?.email ?? "there"}!</h1>
          <p className="text-sm text-ink-muted">One quick thing before you continue.</p>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-hover/50 p-3 text-left">
            <span className="text-sm font-medium leading-5 text-ink-muted">
              <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                Also host events as an organizer
                <InfoTooltip description="Publish events and manage bookings from your dashboard. You can still browse and attend events as usual - this doesn't replace that." />
              </span>
            </span>
            <ToggleSwitch checked={wantsToOrganize} disabled={isUpgrading} onChange={setWantsToOrganize} />
          </div>

          <button
            type="button"
            onClick={continueFromPrompt}
            disabled={isUpgrading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpgrading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
            Continue
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex w-full max-w-[420px] flex-col items-center gap-3 text-center">
        {isError ? (
          <>
            <p className="text-sm font-semibold text-ink">Google sign-in didn&apos;t work</p>
            <AuthErrorBanner message={errorMessage ?? "Please try again."} />
            <a href="/auth/login" className="text-sm font-semibold text-brand underline-offset-4 hover:underline">
              Back to login
            </a>
          </>
        ) : (
          <>
            <LoaderCircle className="size-8 animate-spin text-brand" aria-hidden="true" />
            <p className="text-sm text-ink-muted">
              {isPending ? "Finishing sign-in…" : "Connecting to your Google account…"}
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default OAuthBridgePage;
