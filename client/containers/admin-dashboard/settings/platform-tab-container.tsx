"use client";

import { useState } from "react";
import { AdminSectionTitle } from "@/components/admin-dashboard/widgets/admin-section-title";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

const FEATURE_FLAGS = [
  { id: "maintenance",  label: "Maintenance mode",       description: "Disable public access while deploying updates.",  default: false },
  { id: "registrations",label: "New user registrations", description: "Allow new accounts to be created.",                default: true  },
  { id: "organizerApps",label: "Organizer applications",  description: "Accept new organizer account requests.",           default: true  },
  { id: "autoApprove",  label: "Auto-approve events",     description: "Publish events without manual admin review.",      default: false },
  { id: "smtp",         label: "Email notifications",     description: "Send transactional emails via SMTP.",              default: true  },
  { id: "payments",     label: "Stripe payments",         description: "Enable card payment processing.",                  default: true  },
] as const;

/**
 * Admin Settings — Platform tab. Feature-flag toggles, reusing the shared
 * ToggleSwitch primitive instead of a locally reimplemented one. Local
 * state only for now — these don't persist to the backend yet, so
 * flipping one here doesn't actually change platform behavior. Wiring
 * these to real config endpoints is a separate follow-up.
 */
export function PlatformTabContainer() {
  const [flags, setFlags] = useState<Record<string, boolean>>(
    Object.fromEntries(FEATURE_FLAGS.map((f) => [f.id, f.default])),
  );

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <AdminSectionTitle eyebrow="Configuration" title="Platform settings" />
      <div className="mt-5 grid gap-3">
        {FEATURE_FLAGS.map(({ id, label, description }) => (
          <div
            key={id}
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-background px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
            </div>
            <ToggleSwitch
              checked={flags[id]}
              onChange={(checked) => setFlags((f) => ({ ...f, [id]: checked }))}
              id={`admin-flag-${id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
