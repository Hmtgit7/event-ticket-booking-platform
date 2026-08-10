"use client";

import { useId, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  className?: string;
}

export function FilterSelect({ label, value, options, onChange, className }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const listboxId = useId();

  function selectOption(option: string) {
    onChange(option);
    setOpen(false);
  }

  return (
    <div
      className={cn("relative", className)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 text-left text-sm font-semibold text-ink shadow-sm outline-none transition hover:border-brand/70 focus:border-brand focus:ring-3 focus:ring-brand/20"
      >
        <span className="truncate">{value || label}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-ink-muted transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="thin-dropdown-scroll absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-line bg-popover p-1 text-popover-foreground shadow-xl"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
                className={cn(
                  "flex min-h-9 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-ink outline-none transition hover:bg-surface-hover",
                  selected && "bg-brand text-brand-foreground hover:bg-brand",
                )}
              >
                <span className="truncate">{option}</span>
                {selected && <Check className="size-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
