import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

/**
 * A tappable card for a guided support action (e.g., "Request a refund").
 */
export function SupportActionCard({
  title,
  description,
  icon: Icon,
  onClick,
}: SupportActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group rounded-2xl border border-line bg-background p-5 text-left transition",
        "hover:border-brand hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-surface group-hover:bg-brand/10 transition">
        <Icon className="size-5 text-ink-muted group-hover:text-brand transition" />
      </div>
      <p className="mt-3 font-bold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-muted">{description}</p>
    </button>
  );
}
