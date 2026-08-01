"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  action?: ReactNode;
};

export function AuthInput({
  id,
  label,
  error,
  action,
  className,
  ...props
}: AuthInputProps) {
  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            "h-11 w-full rounded-xl border border-line bg-background px-3.5 text-sm font-medium text-ink outline-none transition placeholder:text-ink-muted hover:border-brand/40 focus:border-brand focus:ring-3 focus:ring-brand/20 disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-ink-muted",
            action ? "pr-12" : "",
            error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "",
            className,
          )}
          {...props}
        />
        {action ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {action}
          </div>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
