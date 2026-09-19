"use client";

import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { ThemeToggle } from "@/components/theme-toggle";

/** Customer Settings — Preferences tab. */
export function PreferencesTabContainer() {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <SectionTitle eyebrow="Display" title="Preferences" />
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">Theme preference</p>
          <p className="mt-1 text-sm text-ink-muted">
            Use the same theme control as the dashboard topbar.
          </p>
        </div>
        <ThemeToggle />
      </div>
    </section>
  );
}
