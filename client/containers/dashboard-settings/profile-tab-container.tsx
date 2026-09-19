"use client";

import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";

/**
 * Organizer Settings — Profile tab. Fields are mock/local for now;
 * wiring to real organizer profile data is a separate follow-up.
 */
export function ProfileTabContainer() {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <SectionTitle eyebrow="Account" title="Organizer profile" />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-ink-muted">Display name</span>
          <input
            type="text"
            defaultValue="Organizer"
            className="mt-1 h-10 w-full rounded-xl border border-line bg-background px-3 text-sm text-ink outline-none focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-ink-muted">Contact email</span>
          <input
            type="email"
            defaultValue="organizer@grabmyticket.com"
            className="mt-1 h-10 w-full rounded-xl border border-line bg-background px-3 text-sm text-ink outline-none focus:border-brand"
          />
        </label>
      </div>
    </section>
  );
}
