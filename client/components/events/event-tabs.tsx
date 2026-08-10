"use client";

import { cn } from "@/lib/utils";
import type { EventTab, EventTabKey } from "@/types/dashboard.types";

interface EventTabsProps {
  tabs: EventTab[];
  active: EventTabKey;
  onChange: (key: EventTabKey) => void;
}

/** Pill tab switcher (Active / Past / Draft) with counts, matching the
 * reference dashboard's Events page header. */
export function EventTabs({ tabs, active, onChange }: EventTabsProps) {
  return (
    <div role="tablist" className="flex w-fit gap-2 rounded-full border border-line bg-surface p-1.5 shadow-sm">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              isActive ? "bg-brand text-brand-foreground shadow-sm" : "text-ink-muted hover:bg-surface-hover hover:text-ink",
            )}
          >
            {tab.label} ({tab.count})
          </button>
        );
      })}
    </div>
  );
}
