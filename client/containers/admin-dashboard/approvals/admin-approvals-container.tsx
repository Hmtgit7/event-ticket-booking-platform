"use client";

import { useEffect, useState } from "react";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { ApprovalRow } from "@/components/admin-dashboard/approvals/approval-row";
import { EmptyState } from "@/components/common/empty-state";
import { NoResultsIllustration } from "@/icons/empty-state-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { adminApprovalsService } from "@/services/admin-approvals.service";
import type { PayoutRequestResponse } from "@/interfaces/payout-api.interface";
import type { AdminCancellationRequestResponse } from "@/interfaces/admin-cancellation-api.interface";

type Tab = "payouts" | "cancellations";

/**
 * Two review queues, one screen - payouts (Phase 2b/2c) and cancellations
 * (Phase 6), both backend-ready and both unused by any UI until now. Each
 * tab loads independently so switching between them doesn't re-fetch data
 * already in memory.
 */
export function AdminApprovalsContainer() {
  const [tab, setTab] = useState<Tab>("payouts");
  const [payouts, setPayouts] = useState<PayoutRequestResponse[] | null>(null);
  const [cancellations, setCancellations] = useState<AdminCancellationRequestResponse[] | null>(null);

  useEffect(() => {
    if (tab === "payouts" && payouts === null) {
      adminApprovalsService.getPendingPayouts().then((res) => setPayouts(res.items));
    }
    if (tab === "cancellations" && cancellations === null) {
      adminApprovalsService.getPendingCancellations().then((res) => setCancellations(res.items));
    }
  }, [tab, payouts, cancellations]);

  async function handleApprovePayout(id: string) {
    const updated = await adminApprovalsService.approvePayout(id);
    setPayouts((prev) => (prev ?? []).map((p) => (p.id === id ? updated : p)));
  }

  async function handleRejectPayout(id: string, note: string) {
    const updated = await adminApprovalsService.rejectPayout(id, note);
    setPayouts((prev) => (prev ?? []).map((p) => (p.id === id ? updated : p)));
  }

  async function handleApproveCancellation(id: string) {
    const updated = await adminApprovalsService.approveCancellation(id);
    setCancellations((prev) => (prev ?? []).map((c) => (c.id === id ? updated : c)));
  }

  async function handleRejectCancellation(id: string, note: string) {
    const updated = await adminApprovalsService.rejectCancellation(id, note);
    setCancellations((prev) => (prev ?? []).map((c) => (c.id === id ? updated : c)));
  }

  const pendingPayoutCount = payouts?.filter((p) => p.status === "REQUESTED").length ?? 0;
  const pendingCancellationCount = cancellations?.filter((c) => c.status === "REQUESTED").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AdminSectionTitle eyebrow="Management" title="Approvals" />
          <div className="flex gap-2">
            <TabButton active={tab === "payouts"} onClick={() => setTab("payouts")} label="Payouts" count={pendingPayoutCount} />
            <TabButton active={tab === "cancellations"} onClick={() => setTab("cancellations")} label="Cancellations" count={pendingCancellationCount} />
          </div>
        </div>
      </div>

      {tab === "payouts" ? (
        <QueueList
          items={payouts}
          emptyTitle="No payout requests"
          renderRow={(payout: PayoutRequestResponse) => (
            <ApprovalRow
              key={payout.id}
              id={payout.id}
              title={`Organizer ${payout.organizerId.slice(0, 8)}…`}
              subtitle={new Date(payout.createdAt).toLocaleDateString()}
              amountLabel={`₹${payout.amount.toFixed(2)}`}
              status={payout.status}
              reviewNote={payout.reviewNote}
              onApprove={handleApprovePayout}
              onReject={handleRejectPayout}
            />
          )}
        />
      ) : (
        <QueueList
          items={cancellations}
          emptyTitle="No cancellation requests"
          renderRow={(request: AdminCancellationRequestResponse) => (
            <ApprovalRow
              key={request.id}
              id={request.id}
              title={request.reason}
              subtitle={new Date(request.createdAt).toLocaleDateString()}
              amountLabel={request.refundAmount != null ? `₹${request.refundAmount.toFixed(2)}` : "—"}
              status={request.status}
              reviewNote={request.reviewNote}
              onApprove={handleApproveCancellation}
              onReject={handleRejectCancellation}
            />
          )}
        />
      )}
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold transition",
        active ? "border-brand bg-brand text-brand-foreground" : "border-line bg-background text-ink hover:border-brand",
      )}
    >
      {label}
      {count > 0 && <span className="ml-1.5 opacity-80">({count})</span>}
    </button>
  );
}

function QueueList<T>({
  items,
  emptyTitle,
  renderRow,
}: {
  items: T[] | null;
  emptyTitle: string;
  renderRow: (item: T) => React.ReactNode;
}) {
  if (items === null) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<NoResultsIllustration className="size-24" />}
        title={emptyTitle}
        description="Nothing waiting on your review right now."
      />
    );
  }

  return <div className="flex flex-col gap-2">{items.map(renderRow)}</div>;
}
