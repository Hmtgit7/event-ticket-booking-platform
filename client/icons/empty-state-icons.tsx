interface EmptyIconProps {
  className?: string;
}

/**
 * Generic empty-state illustrations — pure inline SVG (no network request,
 * scales cleanly, and recolors automatically via `currentColor` + Tailwind
 * text classes so they always match light/dark theme tokens). Each one is
 * intentionally minimal: a soft circle backdrop + a simple line icon, in
 * the same spirit as `GrabMyTicketLogoMark` but generic enough to reuse
 * across every "nothing here yet" screen in the app.
 */

function IconShell({ className, children }: EmptyIconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="80" cy="80" r="80" className="fill-line/40" />
      {children}
    </svg>
  );
}

/** No events / nothing published — a ticket with a dashed perforation. */
export function NoEventsIllustration({ className }: EmptyIconProps) {
  return (
    <IconShell className={className}>
      <rect x="42" y="55" width="76" height="50" rx="10" className="fill-surface stroke-ink-muted" strokeWidth="3" />
      <line x1="80" y1="55" x2="80" y2="105" className="stroke-ink-muted" strokeWidth="3" strokeDasharray="5 6" />
      <circle cx="58" cy="72" r="4" className="fill-brand" />
      <line x1="90" y1="72" x2="106" y2="72" className="stroke-ink-muted" strokeWidth="3" strokeLinecap="round" />
      <line x1="90" y1="84" x2="102" y2="84" className="stroke-ink-muted" strokeWidth="3" strokeLinecap="round" />
    </IconShell>
  );
}

/** No search / filter results — magnifying glass over a blank card. */
export function NoResultsIllustration({ className }: EmptyIconProps) {
  return (
    <IconShell className={className}>
      <rect x="48" y="50" width="52" height="64" rx="8" className="fill-surface stroke-ink-muted" strokeWidth="3" />
      <line x1="58" y1="66" x2="86" y2="66" className="stroke-ink-muted" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="78" x2="80" y2="78" className="stroke-ink-muted" strokeWidth="3" strokeLinecap="round" />
      <circle cx="98" cy="96" r="16" className="fill-surface stroke-brand" strokeWidth="4" />
      <line x1="109" y1="107" x2="120" y2="118" className="stroke-brand" strokeWidth="4" strokeLinecap="round" />
    </IconShell>
  );
}

/** No orders / bookings yet — a ticket stub with a check circle. */
export function NoOrdersIllustration({ className }: EmptyIconProps) {
  return (
    <IconShell className={className}>
      <rect x="40" y="60" width="80" height="46" rx="10" className="fill-surface stroke-ink-muted" strokeWidth="3" />
      <circle cx="40" cy="83" r="6" className="fill-canvas stroke-ink-muted" strokeWidth="3" />
      <circle cx="120" cy="83" r="6" className="fill-canvas stroke-ink-muted" strokeWidth="3" />
      <line x1="54" y1="74" x2="90" y2="74" className="stroke-ink-muted" strokeWidth="3" strokeLinecap="round" />
      <line x1="54" y1="86" x2="78" y2="86" className="stroke-ink-muted" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="92" r="12" className="fill-positive" />
      <path d="M95 92l3.5 3.5L106 88" className="stroke-canvas" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </IconShell>
  );
}

/** Empty wallet / no transactions — a wallet with a small plus badge. */
export function NoWalletActivityIllustration({ className }: EmptyIconProps) {
  return (
    <IconShell className={className}>
      <rect x="42" y="58" width="76" height="52" rx="10" className="fill-surface stroke-ink-muted" strokeWidth="3" />
      <path d="M42 74h76" className="stroke-ink-muted" strokeWidth="3" />
      <circle cx="100" cy="86" r="7" className="fill-canvas stroke-ink-muted" strokeWidth="3" />
      <circle cx="116" cy="98" r="12" className="fill-brand" />
      <line x1="116" y1="93" x2="116" y2="103" className="stroke-brand-foreground" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="111" y1="98" x2="121" y2="98" className="stroke-brand-foreground" strokeWidth="2.5" strokeLinecap="round" />
    </IconShell>
  );
}

/** Nothing saved yet — an outlined heart. */
export function NoSavedIllustration({ className }: EmptyIconProps) {
  return (
    <IconShell className={className}>
      <path
        d="M80 104s-28-16.9-28-36.4C52 56.9 60.3 49 70.4 49c4.5 0 8.9 1.9 12 5.4h.1c3.1-3.5 7.5-5.4 12-5.4C104.7 49 113 56.9 113 67.6 113 87.1 80 104 80 104z"
        className="fill-surface stroke-brand"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </IconShell>
  );
}

/** No notifications — a bell with no badge/dot. */
export function NoNotificationsIllustration({ className }: EmptyIconProps) {
  return (
    <IconShell className={className}>
      <path
        d="M80 52c-11 0-19 8.6-19 19.2v10.6c0 4-1.6 7.8-4.4 10.7L54 95h52l-2.6-2.5a15.3 15.3 0 0 1-4.4-10.7V71.2C99 60.6 91 52 80 52z"
        className="fill-surface stroke-ink-muted"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M72 101a8 8 0 0 0 16 0" className="stroke-ink-muted" strokeWidth="3" fill="none" strokeLinecap="round" />
    </IconShell>
  );
}

/** Generic error / something went wrong — alert triangle. */
export function ErrorStateIllustration({ className }: EmptyIconProps) {
  return (
    <IconShell className={className}>
      <path
        d="M80 48l38 66H42l38-66z"
        className="fill-surface stroke-brand"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <line x1="80" y1="72" x2="80" y2="92" className="stroke-brand" strokeWidth="4" strokeLinecap="round" />
      <circle cx="80" cy="102" r="3" className="fill-brand" />
    </IconShell>
  );
}
