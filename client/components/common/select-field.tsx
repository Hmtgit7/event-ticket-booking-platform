"use client";

import { useId, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectFieldProps {
  id?: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Applies the same red-border treatment as a required-but-empty text
   * input elsewhere in the app - pass this from the field's own
   * validation state rather than relying on the browser's native
   * :invalid styling, which renders inconsistently (and uglily) across
   * browsers for <select>. */
  invalid?: boolean;
  className?: string;
}

/**
 * Custom-styled dropdown standing in for a native <select>. Browsers
 * render native selects with their own OS chrome (see the Category field
 * in Create Event before this existed) which breaks visual consistency
 * with the rest of the design system - this renders as a normal
 * accessible listbox instead, matching FilterSelect's interaction
 * pattern but shaped for a single labeled form field: an `id` for label
 * association, a distinct placeholder state, and invalid styling.
 *
 * Reach for this anywhere a form needs a dropdown - don't reach for a
 * raw <select>.
 */
export function SelectField({
  id,
  value,
  options,
  onChange,
  placeholder = "Select…",
  disabled,
  invalid,
  className,
}: SelectFieldProps) {
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
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-line bg-background px-3 text-left text-sm outline-none transition",
          "hover:border-brand/70 focus:border-brand",
          "disabled:cursor-not-allowed disabled:opacity-60",
          invalid ? "border-brand" : "border-line",
          value ? "text-ink" : "text-ink-muted",
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={placeholder}
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
