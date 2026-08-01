import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings | GrabMyTicket" };

export default function SettingsPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-4">
      <div className="rounded-3xl bg-surface p-10 text-center shadow-sm">
        <h1 className="text-lg font-bold text-ink">Settings</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-muted">
          Account and workspace settings aren&apos;t part of this dummy build yet.
        </p>
      </div>
    </div>
  );
}
