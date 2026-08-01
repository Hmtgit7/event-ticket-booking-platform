import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GrabMyTicketLogoMark } from "@/icons/grabmyticket-logo";
import { cn } from "@/lib/utils";

interface SidebarDownloadCardProps {
  collapsed: boolean;
}

/** Bottom-of-sidebar promo card, matching the reference dashboard's
 * "Download Our Mobile App" tile. Purely decorative in this dummy build. */
export function SidebarDownloadCard({ collapsed }: SidebarDownloadCardProps) {
  if (collapsed) {
    return (
      <div className="flex justify-center rounded-xl bg-sidebar-accent p-3">
        <GrabMyTicketLogoMark className="size-5 text-sidebar-foreground" />
      </div>
    );
  }

  return (
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
        Get another easy way
      </p>
      <Button size="sm" className="mt-3 w-full bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/85">
        Download Now
      </Button>
    </div>
  );
}
