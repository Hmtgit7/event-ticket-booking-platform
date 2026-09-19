"use client";

import { Button } from "@/components/ui/button";

/** Admin Settings — Danger Zone tab. Irreversible, platform-wide ops. */
export function DangerZoneTabContainer() {
  return (
    <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">Danger Zone</p>
      <h2 className="mt-1 text-xl font-bold text-ink">Destructive actions</h2>
      <p className="mt-2 text-sm text-ink-muted">
        These actions are irreversible. Proceed with caution.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="destructive" size="sm">Flush cache</Button>
        <Button variant="destructive" size="sm">Purge draft events</Button>
        <Button variant="destructive" size="sm">Reset rate limits</Button>
      </div>
    </div>
  );
}
