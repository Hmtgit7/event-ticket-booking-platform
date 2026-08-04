"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Smartphone, X, Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EarlyAccessModalProps {
  open: boolean;
  onClose: () => void;
}

// useSyncExternalStore-based client detection — no setState-in-effect lint error
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function EarlyAccessModal({ open, onClose }: EarlyAccessModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isClient = useIsClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);
    // Replace with your real API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
      setError("");
    }, 300);
  };

  if (!isClient || !open) return null;

  return createPortal(
    /* Anchored to true viewport — not affected by sidebar width or any parent transform */
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {/* The card itself re-enables pointer events */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-surface border border-line shadow-2xl p-6"
        style={{ pointerEvents: "auto" }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 flex size-7 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {submitted ? (
          /* ── Success ── */
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="size-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">
                You&apos;re on the list!
              </h2>
              <p className="mt-1.5 text-sm text-ink-muted">
                We&apos;ll notify{" "}
                <span className="font-medium text-ink">
                  {email.trim()}
                </span>{" "}
                the moment the GrabMyTicket app goes live.
              </p>
            </div>
            <Button onClick={handleClose} className="mt-2 w-full">
              Got it
            </Button>
          </div>
        ) : (
          /* ── Default ── */
          <>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                <Smartphone className="size-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink">
                  Get Early Access
                </h2>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed max-w-xs mx-auto">
                  The GrabMyTicket mobile app is coming soon. Drop your email
                  and we&apos;ll notify you the moment we launch.
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5">
              {[
                "Book tickets on the go, anytime",
                "Instant QR code access in your pocket",
                "Exclusive early-bird offers for app users",
              ].map((text) => (
                <li
                  key={text}
                  className="flex items-start gap-2.5 text-sm text-ink-muted"
                >
                  <Bell className="size-4 mt-0.5 shrink-0 text-primary" />
                  {text}
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading}
                  className={[
                    "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors",
                    "bg-canvas",
                    "text-ink",
                    "placeholder:text-ink-muted",
                    error
                      ? "border-red-400 ring-2 ring-red-200"
                      : "border-line focus:border-brand focus:ring-2 focus:ring-brand/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  ].join(" ")}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Submitting…" : "Notify Me on Launch 🚀"}
              </Button>
            </form>

            <p className="mt-3 text-center text-xs text-ink-muted/70">
              No spam, ever. Unsubscribe at any time.
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
