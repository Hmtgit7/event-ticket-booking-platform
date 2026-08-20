"use client";

import { RefreshCcw, Send, Users, Download, MessageCircle } from "lucide-react";
import { SectionTitle } from "@/components/user-dashboard/widgets/section-title";
import { SupportActionCard } from "@/components/user-dashboard/support/support-action-card";
import { SupportTicketsPanel } from "@/components/common/support/support-tickets-panel";

const ACTIONS = [
  { title: "Request a refund",     description: "Start a guided refund request.",           icon: RefreshCcw    },
  { title: "Transfer a ticket",    description: "Send your ticket to another person.",       icon: Send          },
  { title: "Contact organizer",    description: "Send a message to the event organizer.",    icon: Users         },
  { title: "Download tickets",     description: "Re-download any of your ticket PDFs.",      icon: Download      },
  { title: "Live chat support",    description: "Chat with a support agent in real time.",   icon: MessageCircle },
];

/**
 * Help & Support page container — quick-action cards (still placeholders;
 * refund/transfer/live-chat aren't part of the SupportTicket system) plus
 * the real submit-a-ticket / view-my-tickets panel.
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

      <SupportTicketsPanel />
    </div>
  );
}
