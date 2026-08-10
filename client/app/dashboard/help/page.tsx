import type { Metadata } from "next";

export const metadata: Metadata = { title: "Help | GrabMyTicket" };

export default function HelpPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-4">
      <div className="rounded-3xl bg-surface p-10 text-center shadow-sm">
        <p className="max-w-xs text-sm text-ink-muted">
          A help center isn&apos;t part of this dummy build yet.
        </p>
      </div>
    </div>
  );
}
