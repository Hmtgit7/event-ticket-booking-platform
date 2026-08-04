import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper that renders a label, the field children, an optional hint,
 * and an optional validation error — consistent across every input in
 * the create-event form.
 */
export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-brand" aria-hidden>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-ink-muted">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-brand" role="alert">{error}</p>
      )}
    </div>
  );
}

/** Shared input className so every text input looks the same. */
export const inputCls =
  "h-10 w-full rounded-xl border border-line bg-background px-3 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-brand aria-invalid:border-brand";

/** Shared textarea className. */
export const textareaCls =
  "w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none resize-none transition focus:border-brand";

/** Shared select className. */
export const selectCls =
  "h-10 w-full rounded-xl border border-line bg-background px-3 text-sm text-ink outline-none transition focus:border-brand cursor-pointer";
