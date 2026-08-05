import type { Metadata } from "next";

import { ChangePasswordCard } from "@/components/auth/change-password-card";

export const metadata: Metadata = { title: "Settings | GrabMyTicket" };

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 py-4">
      <div>
        <h1 className="text-lg font-bold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage your account security.</p>
      </div>

      <ChangePasswordCard />
    </div>
  );
}
