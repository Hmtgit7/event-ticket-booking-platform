"use client";

import { useState } from "react";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { Button } from "@/components/ui/button";

interface ToggleRowProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function ToggleRow({ label, description, defaultChecked = false }: ToggleRowProps) {
  const [enabled, setEnabled] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-background px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((v) => !v)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${enabled ? "bg-brand" : "bg-line"}`}
      >
        <span className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

/** Admin platform settings page. */
export function AdminSettingsContainer() {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Platform config ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <AdminSectionTitle eyebrow="Configuration" title="Platform Settings" />
        <div className="mt-5 grid gap-3">
          <ToggleRow label="Maintenance mode"          description="Disable public access while deploying updates."  defaultChecked={false} />
          <ToggleRow label="New user registrations"    description="Allow new accounts to be created."               defaultChecked={true}  />
          <ToggleRow label="Organizer applications"    description="Accept new organizer account requests."           defaultChecked={true}  />
          <ToggleRow label="Email notifications"       description="Send transactional emails via SMTP."              defaultChecked={true}  />
          <ToggleRow label="Stripe payments"           description="Enable card payment processing."                  defaultChecked={true}  />
          <ToggleRow label="Auto-approve events"       description="Publish events without manual admin review."      defaultChecked={false} />
        </div>
      </div>

      {/* ── Danger zone ── */}
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Danger Zone</p>
        <h2 className="mt-1 font-heading text-2xl font-extrabold text-ink">Destructive actions</h2>
        <p className="mt-2 text-sm text-ink-muted">
          These actions are irreversible. Proceed with caution.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="destructive" size="sm">Flush cache</Button>
          <Button variant="destructive" size="sm">Purge draft events</Button>
          <Button variant="destructive" size="sm">Reset rate limits</Button>
        </div>
      </div>
    </div>
  );
}
