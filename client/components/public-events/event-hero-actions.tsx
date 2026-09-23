"use client";

import { useState } from "react";
import { Check, Heart, Share2 } from "lucide-react";
import { useSavedEventsStore } from "@/store/saved-events-store";
import type { EventSummaryResponse } from "@/interfaces/event-api.interface";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

interface EventHeroActionsProps {
  event: EventSummaryResponse;
  className?: string;
}

const BUTTON_CLS =
  "flex size-10 items-center justify-center rounded-full bg-black/45 text-on-elevated backdrop-blur transition hover:bg-black/60";

/**
 * Share + Save (wishlist) icon buttons overlaid on the public event hero.
 * Save writes to the client-side saved-events store (see
 * store/saved-events-store.ts) - the same store the Saved Events dashboard
 * page reads from, so toggling here shows up there immediately. Share
 * prefers the native Web Share API (mobile browsers, most modern desktop
 * browsers) and falls back to copy-link with brief inline confirmation.
 */
export function EventHeroActions({ event, className }: EventHeroActionsProps) {
  const t = useTranslations("browse");
  const isSaved = useSavedEventsStore((state) => state.isSaved(event.id));
  const toggleSaved = useSavedEventsStore((state) => state.toggleSaved);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: event.title, url });
      } catch {
        // User dismissed the native share sheet - not an error worth surfacing.
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? t("linkCopied", "Link copied") : t("share", "Share")}
        className={BUTTON_CLS}
      >
        {copied ? <Check className="size-[18px]" /> : <Share2 className="size-[18px]" />}
      </button>
      <button
        type="button"
        onClick={() => toggleSaved(event)}
        aria-label={isSaved ? t("saved", "Saved") : t("save", "Save event")}
        aria-pressed={isSaved}
        className={BUTTON_CLS}
      >
        <Heart className={cn("size-[18px]", isSaved && "fill-brand text-brand")} />
      </button>
    </div>
  );
}
