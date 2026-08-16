import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<string, string> = {
  neutral: "bg-muted text-ink-muted",
  positive: "bg-positive/10 text-positive",
  warning: "bg-amber-500/10 text-amber-600",
  negative: "bg-destructive/10 text-destructive",
};

const STATUS_TONE: Record<string, keyof typeof TONE_CLASSES> = {
  PENDING: "warning",
  ACTIVE: "positive",
  FAILED: "negative",
  REQUESTED: "warning",
  APPROVED: "warning",
  REJECTED: "negative",
  PAID: "positive",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  ACTIVE: "Verified",
  FAILED: "Failed",
  REQUESTED: "Requested",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PAID: "Paid",
};

/** Shared status pill for both payout account status and payout request status - same status vocabulary style, different underlying enums. */
export function PayoutStatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? "neutral";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", TONE_CLASSES[tone])}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
