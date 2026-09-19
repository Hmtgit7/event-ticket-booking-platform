"use client";

import { ChangePasswordCard } from "@/components/auth/change-password-card";
import { DangerZoneCard } from "@/components/auth/danger-zone-card";

/** Organizer Settings — Security tab. */
export function SecurityTabContainer() {
  return (
    <div className="flex flex-col gap-5">
      <ChangePasswordCard />
      <DangerZoneCard persona="organizer" />
    </div>
  );
}
