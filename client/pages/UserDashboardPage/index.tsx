"use client";

import { useLogout } from "@/modules/auth/hooks/use-logout";

/** Placeholder only - real attendee dashboard (bookings, tickets, etc.) is future work. */
export function UserDashboardPage() {
  const logout = useLogout();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background text-ink">
      <h1 className="text-6xl font-black tracking-tight">USER</h1>
      <p className="text-sm text-ink-muted">Attendee dashboard - coming soon.</p>
      <button
        type="button"
        onClick={logout}
        className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand/90"
      >
        Log out
      </button>
    </main>
  );
}

export default UserDashboardPage;
