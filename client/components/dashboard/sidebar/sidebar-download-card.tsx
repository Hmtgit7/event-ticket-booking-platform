"use client";

import { useState } from "react";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GrabMyTicketLogoMark } from "@/icons/grabmyticket-logo";
import { cn } from "@/lib/utils";
import { EarlyAccessModal } from "./early-access-modal";

interface SidebarDownloadCardProps {
  collapsed: boolean;
}

/** Bottom-of-sidebar promo card.
 *  - Collapsed: a small icon-only button that opens the Early Access modal.
 *  - Expanded: the full "Download Our Mobile App" card with a CTA.
 *  Both states open the same centered Early Access modal. */
export function SidebarDownloadCard({ collapsed }: SidebarDownloadCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {collapsed ? (
        /* ── Collapsed: single icon button ── */
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          aria-label="Get early access to mobile app"
          className="flex w-full items-center justify-center rounded-xl bg-sidebar-accent p-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors"
        >
          <Smartphone className="size-[18px] shrink-0" />
        </button>
      ) : (
        /* ── Expanded: full promo card ── */
        <div className={cn("rounded-2xl bg-sidebar-accent p-4")}>
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <GrabMyTicketLogoMark className="size-5" />
            <p className="text-sm font-semibold leading-tight">
              Download Our
              <br />
              Mobile App
            </p>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-sidebar-foreground/60">
            <Smartphone className="size-3.5" />
            Get notified when we launch
          </p>
          <Button
            size="sm"
            className="mt-3 w-full bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/85"
            onClick={() => setModalOpen(true)}
          >
            Get Early Access
          </Button>
        </div>
      )}

      <EarlyAccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
