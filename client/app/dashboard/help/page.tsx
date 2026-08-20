import type { Metadata } from "next";
import { SupportTicketsPanel } from "@/components/common/support/support-tickets-panel";

export const metadata: Metadata = { title: "Help" };

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Help</p>
        <h1 className="mt-1 text-xl font-bold text-ink">Support center</h1>
        <p className="mt-1 text-sm text-ink-muted">Need help with a booking, payout, or event? Open a ticket below.</p>
      </div>
      <SupportTicketsPanel />
    </div>
  );
}
