"use client";

import { LayoutGrid, List, ListFilter, CalendarRange, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventViewMode } from "@/types/dashboard.types";

interface EventFiltersProps {
  viewMode: EventViewMode;
  onViewModeChange: (mode: EventViewMode) => void;
}

/** Right-aligned toolbar: filter icon, category/date dropdown stand-ins,
 * and a grid/list view toggle. Dropdowns are decorative for this dummy
 * build — only the view toggle is actually wired up. */
export function EventFilters({ viewMode, onViewModeChange }: EventFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <IconButton icon={ListFilter} label="Filters" />
      <PillButton label="All Category" icon={ChevronDown} />
      <PillButton label="This Month" icon={CalendarRange} />

      <div className="flex gap-1 rounded-full border border-line bg-surface p-1 shadow-sm">
        <ViewToggleButton icon={LayoutGrid} active={viewMode === "grid"} onClick={() => onViewModeChange("grid")} label="Grid view" />
        <ViewToggleButton icon={List} active={viewMode === "list"} onClick={() => onViewModeChange("list")} label="List view" />
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, label }: { icon: typeof ListFilter; label: string }) {
  return (
    <button type="button" aria-label={label} className="flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-sm">
      <Icon className="size-4" />
    </button>
  );
}

function PillButton({ label, icon: Icon }: { label: string; icon: typeof ChevronDown }) {
  return (
    <button type="button" className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-sm">
      {label}
      <Icon className="size-3.5" />
    </button>
  );
}

function ViewToggleButton({ icon: Icon, active, onClick, label }: { icon: typeof LayoutGrid; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-full transition-colors",
        active ? "bg-brand text-brand-foreground shadow-sm" : "text-ink-muted hover:bg-surface-hover hover:text-ink",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
