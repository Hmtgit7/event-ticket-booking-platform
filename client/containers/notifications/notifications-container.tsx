"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, Calendar, Ticket, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { notificationService } from "@/services/notification.service";
import type { NotificationAudience } from "@/services/notification.service";
import { triggerNotificationRefresh } from "@/lib/notification-events";
import type { NotificationResponse } from "@/interfaces/notification-api.interface";

type NotifType = "booking" | "event" | "alert" | "system";

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

/** Maps backend notification "type" strings (e.g. BOOKING_RECEIVED) to the display bucket used for icon/color - unmapped types fall back to "system" rather than erroring, so a new backend type never breaks this UI. */
function toDisplayType(type: string): NotifType {
  if (type.startsWith("BOOKING_")) return "booking";
  if (type.startsWith("EVENT_")) return "event";
  if (type.startsWith("ALERT_")) return "alert";
  return "system";
}

/** Reusable notifications inbox - same component powers the organizer, user, and admin "Notifications" pages, scoped by the `audience` prop to the signed-in account's real data from notification-service. */
export function NotificationsContainer({ audience }: { audience: NotificationAudience }) {
  const [items, setItems] = useState<NotificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadNotifications = useCallback(() => {
    setIsLoading(true);
    notificationService
      .myNotifications(audience, 0, 50)
      .then((result) => setItems(result.items))
      .finally(() => setIsLoading(false));
  }, [audience]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = items.filter((n) => !n.read).length;
  const visible = filter === "unread" ? items.filter((n) => !n.read) : items;

  function markAllRead() {
    const unread = items.filter((n) => !n.read);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    unread.forEach((n) => notificationService.markRead(n.id).catch(() => {}));
    // The bell's badge is separate local state that only ever changes on its
    // own poll/events - without this, marking read here left it stale until
    // the next 30s poll or a hard refresh.
    triggerNotificationRefresh();
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    notificationService.markRead(id).catch(() => {});
    triggerNotificationRefresh();
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
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-ink-muted">Loading notifications…</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
            <CheckCircle2 className="size-10 text-positive" />
            <p className="text-sm font-semibold text-ink">You&apos;re all caught up!</p>
          </div>
        ) : (
          visible.map((notif) => {
            const displayType = toDisplayType(notif.type);
            const Icon = ICON_MAP[displayType];
            return (
              <button key={notif.id} type="button" onClick={() => markRead(notif.id)}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-4 text-left transition hover:shadow-sm w-full",
                  notif.read
                    ? "border-line bg-background"
                    : "border-brand/20 bg-brand/5"
                )}>
                <div className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl", COLOR_MAP[displayType])}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-semibold", notif.read ? "text-ink-muted" : "text-ink")}>
                      {notif.title}
                    </p>
                    <span className="shrink-0 text-xs text-ink-muted">{formatRelativeTime(notif.createdAt)}</span>
                  </div>
                          <p className="mt-0.5 text-sm text-ink-muted">{notif.message}</p>
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
