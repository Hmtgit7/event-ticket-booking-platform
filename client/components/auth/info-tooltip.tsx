"use client";

import { Info } from "lucide-react";
import { useState } from "react";

interface InfoTooltipProps {
  description: string;
  label?: string;
}

/** Hover to show on desktop, click/tap toggles it open on touch devices - no extra deps. */
export function InfoTooltip({ description, label = "More info" }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={(event) => {
          event.preventDefault();
          setIsOpen((current) => !current);
        }}
        className="rounded-full p-0.5 text-ink-muted outline-none transition hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/25"
      >
        <Info className="size-3.5" aria-hidden="true" />
      </button>

      {isOpen ? (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg border border-line bg-background p-2.5 text-xs font-normal leading-5 text-ink-muted shadow-lg"
        >
          {description}
        </span>
      ) : null}
    </span>
  );
}
