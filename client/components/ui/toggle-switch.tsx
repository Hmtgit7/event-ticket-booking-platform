"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

/** Plain accessible checkbox styled as an iOS-style switch - no extra dependency. */
export function ToggleSwitch({ checked, onChange, disabled, id }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full outline-none transition-colors focus-visible:ring-3 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-brand" : "bg-surface-hover border border-line"
      }`}
    >
      <span
        className={`inline-block size-4.5 transform rounded-full bg-background shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-1"
        }`}
      />
    </button>
  );
}
