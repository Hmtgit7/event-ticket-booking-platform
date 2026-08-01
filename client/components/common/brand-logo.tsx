import Link from "next/link";
import { GrabMyTicketLogoMark } from "@/icons/grabmyticket-logo";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  markClassName?: string;
  textClassName?: string;
}

export function BrandLogo({
  href = "/",
  className,
  markClassName,
  textClassName,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      aria-label="GrabMyTicket home"
      className={cn(
        "flex min-w-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
        className,
      )}
    >
      <GrabMyTicketLogoMark className={cn("size-9 shrink-0", markClassName)} />
      <span
        className={cn(
          "whitespace-nowrap font-[family-name:var(--font-playfair)] text-[17px] font-bold italic leading-none tracking-wide text-current",
          textClassName,
        )}
      >
        GrabMyTicket
      </span>
    </Link>
  );
}
