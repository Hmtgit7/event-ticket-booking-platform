import type { Metadata } from "next";
import { Bell, Palette, Shield, UserRound } from "lucide-react";

import { ChangePasswordCard } from "@/components/auth/change-password-card";
import { DangerZoneCard } from "@/components/auth/danger-zone-card";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = { title: "Settings" };

const settingsNav = [
  { label: "Profile", icon: UserRound, active: true },
  { label: "Preferences", icon: Palette },
  { label: "Notifications", icon: Bell },
  { label: "Security", icon: Shield },
];

export default function SettingsPage() {
  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border border-line bg-surface p-3 shadow-sm">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Settings sections">
          {settingsNav.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${
                active ? "bg-brand text-brand-foreground" : "text-ink-muted hover:bg-surface-hover hover:text-ink"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col gap-5">
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
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

        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">Theme preference</p>
              <p className="mt-1 text-sm text-ink-muted">Use the same theme control as the dashboard topbar.</p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        <ChangePasswordCard />

        <DangerZoneCard persona="organizer" />
      </div>
    </div>
  );
}
