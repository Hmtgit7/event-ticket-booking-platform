import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

/**
 * The single reusable empty-state block for the whole app — replaces every
 * ad hoc "No X found" `<p>` with a consistent illustration + heading +
 * description + optional CTA. Pass one of the illustrations from
 * `@/icons/empty-state-icons` as `icon`.
 *
 * @example
 * <EmptyState
 *   icon={<NoOrdersIllustration className="size-32" />}
 *   title="No orders yet"
 *   description="Book your first ticket and it'll show up here."
 *   action={{ label: "Explore events", href: "/user/dashboard/explore" }}
 * />
 */
export function EmptyState({ icon, title, description, action, secondaryAction, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-surface px-6 py-14 text-center",
        className,
      )}
    >
      {icon}
      <div className="flex flex-col items-center gap-1.5">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        {description ? <p className="max-w-sm text-sm text-ink-muted">{description}</p> : null}
      </div>

      {(action || secondaryAction) && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action ? <EmptyStateButton {...action} variant="primary" /> : null}
          {secondaryAction ? <EmptyStateButton {...secondaryAction} variant="secondary" /> : null}
        </div>
      )}
    </div>
  );
}

function EmptyStateButton({
  label,
  href,
  onClick,
  variant,
}: EmptyStateAction & { variant: "primary" | "secondary" }) {
  const className = cn(
    "rounded-xl px-4 py-2 text-sm font-bold transition",
    variant === "primary"
      ? "bg-brand text-brand-foreground hover:bg-brand/90"
      : "border border-line bg-background text-ink hover:border-brand hover:text-brand",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}
