"use client";

import { RefreshCcw, Send, Users, Download, MessageCircle } from "lucide-react";
import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { SupportActionCard } from "@/components/user-dashboard/support/support-action-card";
import { DUMMY_SUPPORT_TICKETS } from "@/constants/user-dashboard-data";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { title: "Request a refund",     description: "Start a guided refund request.",           icon: RefreshCcw    },
  { title: "Transfer a ticket",    description: "Send your ticket to another person.",       icon: Send          },
  { title: "Contact organizer",    description: "Send a message to the event organizer.",    icon: Users         },
  { title: "Download tickets",     description: "Re-download any of your ticket PDFs.",      icon: Download      },
  { title: "Live chat support",    description: "Chat with a support agent in real time.",   icon: MessageCircle },
];

const STATUS_CLASSES = {
  Open:     "bg-brand/10 text-brand border-brand/30",
  Resolved: "bg-positive/10 text-positive border-positive/30",
  Pending:  "bg-ink/10 text-ink-muted border-line",
};

/**
 * Help & Support page container — quick-action cards and open ticket log.
 */
export function SupportContainer() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <SectionTitle eyebrow="Help" title="Support center" />
        <p className="mt-1 text-sm text-ink-muted">
          How can we help you today?
        </p>
      </div>

      {/* ── Action cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ACTIONS.map((action) => (
          <SupportActionCard key={action.title} {...action} />
        ))}
      </div>

      {/* ── Open tickets ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Your open tickets
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {DUMMY_SUPPORT_TICKETS.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col gap-1 rounded-xl border border-line bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{ticket.subject}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{ticket.id} · {ticket.date}</p>
              </div>
              <span className={cn("rounded-lg border px-3 py-1 text-xs font-bold", STATUS_CLASSES[ticket.status])}>
                {ticket.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
