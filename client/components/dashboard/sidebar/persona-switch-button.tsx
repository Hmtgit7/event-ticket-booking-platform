"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeftRight, Megaphone, Ticket } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.service";
import { personaBroadcast } from "@/lib/persona";
import { usePersona } from "@/hooks/use-persona";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PersonaTransitionOverlay } from "@/components/ui/persona-transition-overlay";
import { cn } from "@/lib/utils";

interface PersonaSwitchButtonProps {
  collapsed?: boolean;
}

/**
 * Sits just below the logo, in both dashboard shells. What it renders
 * depends on the account's role mix - every account holds exactly one
 * role at signup (see AuthService.signup), the other is only ever added
 * later, deliberately, via one of these confirm-and-add flows:
 *
 *  - Dual-role (ROLE_ORGANIZER + ROLE_USER): the "switch persona" button,
 *    confirmed via dialog, persisted via updatePersona.
 *  - Customer-only (ROLE_USER, no ROLE_ORGANIZER): "want to publish
 *    events?" growth CTA. Confirming calls becomeOrganizer, which adds
 *    ROLE_ORGANIZER and returns a fresh session.
 *  - Organizer-only (ROLE_ORGANIZER, no ROLE_USER): "want to buy
 *    tickets?" CTA - the sidebar-initiated twin of the same upgrade
 *    BookNowAction/PersonaSwitchGate trigger when it's intent-driven
 *    (clicking "Book now" on the public site) instead.
 *  - Single-role Admin, or signed out: renders nothing.
 *
 * Either upgrade lands the account in dual-role state, at which point this
 * same slot switches to rendering the persona-switch button instead.
 */
export function PersonaSwitchButton({ collapsed }: PersonaSwitchButtonProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { isDualRole, isUserOnly, isOrganizerOnly } = usePersona();
  const setSession = useAuthStore((state) => state.setSession);
  const setActivePersona = useAuthStore((state) => state.setActivePersona);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (isDualRole) {
    const inOrganizerView = pathname.startsWith("/dashboard");
    const targetPersona = inOrganizerView ? "user" : "organizer";
    const targetPath = inOrganizerView ? "/user/dashboard" : "/dashboard";
    const label = inOrganizerView ? "Switch to Customer view" : "Switch to Organizer view";

    const handleConfirm = async () => {
      setConfirmOpen(false);
      setSwitching(true);
      try {
        await authService.updatePersona(targetPersona);
        setActivePersona(targetPersona);
        personaBroadcast.announce(targetPersona);
        router.push(targetPath);
      } catch {
        setSwitching(false);
      }
    };

    return (
      <>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          title={label}
          aria-label={label}
          className={cn(
            "flex w-full items-center justify-center gap-2.5 rounded-xl border border-sidebar-foreground/10 bg-sidebar-accent/60 px-3 py-2.5 text-xs font-semibold text-sidebar-foreground transition-colors hover:border-brand hover:text-brand",
            collapsed && "px-0",
          )}
        >
          <ArrowLeftRight className="size-[15px] shrink-0" />
          <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
        </button>

        <ConfirmDialog
          open={confirmOpen}
          title={inOrganizerView ? "Switch to Customer view?" : "Switch to Organizer view?"}
          description={
            inOrganizerView
              ? "You'll leave your Organizer dashboard and see GrabMyTicket as a ticket buyer instead. You can switch back anytime."
              : "You'll leave the Customer dashboard and manage your events instead. You can switch back anytime."
          }
          confirmLabel="Sure, switch"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmOpen(false)}
        />
        <PersonaTransitionOverlay
          open={switching}
          message={inOrganizerView ? "Switching to Customer\u2026" : "Switching to Organizer\u2026"}
        />
      </>
    );
  }

  if (isUserOnly) {
    const handleConfirm = async () => {
      setConfirmOpen(false);
      setSwitching(true);
      try {
        const auth = await authService.becomeOrganizer();
        setSession(auth);
        router.push("/dashboard");
      } catch {
        setSwitching(false);
      }
    };

    return (
      <>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          title="Want to publish events?"
          aria-label="Want to publish events?"
          className={cn(
            "flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-brand/40 bg-brand/10 px-3 py-2.5 text-xs font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/15",
            collapsed && "px-0",
          )}
        >
          <Megaphone className="size-[15px] shrink-0" />
          <span className={cn("truncate", collapsed && "sr-only")}>Want to publish events?</span>
        </button>

        <ConfirmDialog
          open={confirmOpen}
          title="Set up your Organizer account?"
          description="You'll get an Organizer dashboard to create and manage events, alongside your existing Customer account. You can switch between the two anytime."
          confirmLabel="Yes, set it up"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmOpen(false)}
        />
        <PersonaTransitionOverlay open={switching} message="Setting up your Organizer account\u2026" />
      </>
    );
  }

  if (isOrganizerOnly) {
    const handleConfirm = async () => {
      setConfirmOpen(false);
      setSwitching(true);
      try {
        const auth = await authService.becomeCustomer();
        setSession(auth);
        router.push("/user/dashboard");
      } catch {
        setSwitching(false);
      }
    };

    return (
      <>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          title="Explore events & buy tickets"
          aria-label="Explore events & buy tickets"
          className={cn(
            "flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-brand/40 bg-brand/10 px-3 py-2.5 text-xs font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/15",
            collapsed && "px-0",
          )}
        >
          <Ticket className="size-[15px] shrink-0" />
          <span className={cn("truncate", collapsed && "sr-only")}>Explore events & buy tickets</span>
        </button>

        <ConfirmDialog
          open={confirmOpen}
          title="Set up your Customer account?"
          description="You'll get a Customer account to browse and book events, alongside your existing Organizer account. You can switch between the two anytime."
          confirmLabel="Yes, set it up"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmOpen(false)}
        />
        <PersonaTransitionOverlay open={switching} message="Setting up your Customer account\u2026" />
      </>
    );
  }

  return null;
}
