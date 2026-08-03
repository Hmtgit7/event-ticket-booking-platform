"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { GoogleIcon } from "@/components/auth/google-icon";

interface GoogleSignInButtonProps {
  disabled?: boolean;
}

/**
 * Kicks off NextAuth's own Google handshake (popup/redirect entirely on the
 * frontend - see docs/architecture.md decision on OAuth). NextAuth lands on
 * /auth/oauth-bridge afterward, which exchanges the resulting ID token with
 * auth-service for our own JWT.
 */
export function GoogleSignInButton({ disabled }: GoogleSignInButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  function handleClick() {
    setIsRedirecting(true);
    void signIn("google", { callbackUrl: "/auth/oauth-bridge" });
  }

  const isBusy = disabled || isRedirecting;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isBusy}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-line bg-background px-3 text-sm font-semibold text-ink outline-none transition hover:border-brand/40 hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isRedirecting ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <GoogleIcon />
      )}
      <span>Continue with Google</span>
    </button>
  );
}
