"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/use-translations";

interface LocationPermissionModalProps {
  open: boolean;
  onAllow: () => void;
  onDismiss: () => void;
}

/**
 * Center modal shown once per browser (see lib/location-storage's
 * "prompted" flag) asking for location access, so we can localize
 * currency/recommendations/timezone by country. Deliberately NOT a raw
 * cold-call to navigator.geolocation on page load - browsers require a
 * user gesture first, and a silent permission prompt with no context is
 * exactly the pattern people distrust and instinctively deny. Same
 * portal/dialog shape as ConfirmDialog - see that file's comment for why
 * this codebase uses a plain implementation instead of a headless-UI
 * primitive.
 */
export function LocationPermissionModal({ open, onAllow, onDismiss }: LocationPermissionModalProps) {
  const t = useTranslations("location");
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onDismiss]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-permission-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onDismiss}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <MapPin className="size-6" />
        </div>
        <h2 id="location-permission-title" className="mt-4 text-lg font-bold text-ink">
          {t("title")}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">{t("body")}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onDismiss}>
            {t("notNow")}
          </Button>
          <Button onClick={onAllow}>{t("allow")}</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
