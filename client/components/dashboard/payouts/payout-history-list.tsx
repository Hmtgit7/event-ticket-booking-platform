import { PayoutStatusBadge } from "@/components/dashboard/payouts/payout-status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { NoWalletActivityIllustration } from "@/icons/empty-state-icons";
import type { PayoutRequestResponse } from "@/interfaces/payout-api.interface";

export function PayoutHistoryList({ requests }: { requests: PayoutRequestResponse[] }) {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={<NoWalletActivityIllustration className="size-28" />}
        title="No payout requests yet"
        description="Once you request a withdrawal, it'll show up here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {requests.map((request) => (
        <div key={request.id} className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
          <div>
            <p className="font-semibold text-ink">₹{request.amount.toFixed(2)}</p>
            <p className="text-xs text-ink-muted">{new Date(request.createdAt).toLocaleDateString()}</p>
            {request.reviewNote && (request.status === "REJECTED" || request.status === "FAILED") && (
              <p className="mt-1 text-xs text-destructive">{request.reviewNote}</p>
            )}
          </div>
          <PayoutStatusBadge status={request.status} />
        </div>
      ))}
    </div>
  );
}
