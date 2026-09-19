"use client";

import { useState } from "react";
import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

const NOTIFICATION_PREFS = [
  {
    id: "email",
    label: "Email notifications",
    description: "Booking confirmations, payout updates, and platform announcements.",
  },
  {
    id: "sms",
    label: "SMS notifications",
    description: "Critical booking and payout alerts sent to your phone.",
  },
  {
    id: "push",
    label: "Push notifications",
    description: "Real-time alerts in the GrabMyTicket app.",
  },
] as const;

/**
 * Organizer Settings — Notifications tab. Local toggle state only for
 * now; persisting preferences to the backend is a separate follow-up.
 */
export function NotificationsTabContainer() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    email: true,
    sms: false,
    push: true,
  });

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <SectionTitle eyebrow="Alerts" title="Notification preferences" />
      <div className="mt-5 flex flex-col gap-4">
        {NOTIFICATION_PREFS.map(({ id, label, description }) => (
          <div
            key={id}
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-background px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="mt-1 text-sm text-ink-muted">{description}</p>
            </div>
            <ToggleSwitch
              checked={prefs[id]}
              onChange={(checked) => setPrefs((p) => ({ ...p, [id]: checked }))}
              id={`organizer-notif-${id}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
