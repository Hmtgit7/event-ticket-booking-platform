"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { ChangePasswordCard } from "@/components/auth/change-password-card";

const PROFILE_FIELDS = [
  { label: "Full name",    value: "Hemant Gehlod" },
  { label: "Email",        value: "hemant@example.com" },
  { label: "Phone",        value: "Not set" },
  { label: "Member since", value: "January 2024" },
];

/**
 * Profile page container — shows account readiness, profile details,
 * and security status.
 */
export function ProfileContainer() {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Profile fields ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <SectionTitle eyebrow="Account" title="Your profile" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {PROFILE_FIELDS.map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-line bg-background px-4 py-3">
              <p className="text-xs text-ink-muted">{label}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-5" size="sm">
          <Settings className="size-4" />
          Edit profile
        </Button>
      </div>

      {/* ── Profile completeness ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <SectionTitle eyebrow="Setup" title="Profile readiness" />
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-background">
          <div className="h-3 w-[82%] rounded-full bg-positive transition-all" />
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          82% complete — add a phone number and emergency contact to finish.
        </p>
      </div>

      {/* ── Security ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <SectionTitle eyebrow="Security" title="Account security" />
        <div className="mt-4">
          <ChangePasswordCard />
        </div>
      </div>
    </div>
  );
}
