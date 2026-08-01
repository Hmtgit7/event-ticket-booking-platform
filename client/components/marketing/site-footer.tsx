import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";

const LINKS = [
  { label: "Browse events", href: "/events" },
  { label: "Organizer dashboard", href: "/dashboard" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy-policy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-sm">
            <BrandLogo />
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Public event discovery and private organizer operations in one consistent ticketing platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-xl bg-canvas px-3 py-2 text-sm font-semibold text-ink-muted hover:text-ink">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-xs font-medium text-ink-muted">
          © 2026 GrabMyTicket. Built for organizers, guests, and smooth event days.
        </p>
      </div>
    </footer>
  );
}
