"use client";

import { useState } from "react";
import { Bell, Calendar, Ticket, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NotifType = "booking" | "event" | "alert" | "system";

interface OrgNotification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const ICON_MAP: Record<NotifType, React.ElementType> = {
  booking: Ticket,
  event:   Calendar,
  alert:   AlertCircle,
  system:  Bell,
};

const COLOR_MAP: Record<NotifType, string> = {
  booking: "bg-positive/10 text-positive",
  event:   "bg-brand/10 text-brand",
  alert:   "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  system:  "bg-ink/5 text-ink-muted",
};

const SEED: OrgNotification[] = [
  { id: "n1", type: "booking",  title: "New booking received",            body: "3 VIP tickets for Fashion Empire purchased by Alice Sharma.",      time: "2 min ago",  read: false },
  { id: "n2", type: "event",    title: "Event published",                 body: "Your event \"Hip Hop Thugs\" is now live and accepting bookings.",  time: "1 hr ago",   read: false },
  { id: "n3", type: "alert",    title: "Low ticket inventory",            body: "How to Camp has fewer than 10 seats remaining.",                   time: "3 hrs ago",  read: false },
  { id: "n4", type: "booking",  title: "Booking cancelled",               body: "1 General ticket for Food Exhibition was cancelled by Bob F.",     time: "5 hrs ago",  read: true  },
  { id: "n5", type: "system",   title: "Payout processed",                body: "$2,450.00 has been transferred to your bank account.",             time: "Yesterday",  read: true  },
  { id: "n6", type: "alert",    title: "Event flagged for review",        body: "\"How to Camp\" was flagged by a user. Admin review pending.",     time: "2 days ago", read: true  },
  { id: "n7", type: "system",   title: "Profile verification complete",   body: "Your organizer account is fully verified.",                        time: "3 days ago", read: true  },
];

/** Organizer notifications centre. */
export function NotificationsContainer() {
  const [items, setItems] = useState<OrgNotification[]>(SEED);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = items.filter((n) => !n.read).length;
  const visible = filter === "unread" ? items.filter((n) => !n.read) : items;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Inbox</p>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-ink-muted">{unreadCount} unread</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={cn("rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition",
                filter === f
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-line bg-background text-ink hover:border-brand"
              )}>
              {f}
            </button>
          ))}
          {unreadCount > 0 && (
            <button type="button" onClick={markAllRead}
              className="rounded-full border border-line bg-background px-4 py-1.5 text-sm font-medium text-ink-muted hover:text-ink transition">
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex flex-col gap-2">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
            <CheckCircle2 className="size-10 text-positive" />
            <p className="text-sm font-semibold text-ink">You&apos;re all caught up!</p>
          </div>
        ) : (
          visible.map((notif) => {
            const Icon = ICON_MAP[notif.type];
            return (
              <button key={notif.id} type="button" onClick={() => markRead(notif.id)}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-4 text-left transition hover:shadow-sm w-full",
                  notif.read
                    ? "border-line bg-background"
                    : "border-brand/20 bg-brand/5"
                )}>
                <div className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl", COLOR_MAP[notif.type])}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-semibold", notif.read ? "text-ink-muted" : "text-ink")}>
                      {notif.title}
                    </p>
                    <span className="shrink-0 text-xs text-ink-muted">{notif.time}</span>
                  </div>
                          <p className="mt-0.5 text-sm text-ink-muted">{notif.body}</p>
                </div>
                {!notif.read && (
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
