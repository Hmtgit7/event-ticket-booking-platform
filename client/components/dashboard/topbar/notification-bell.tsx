"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { notificationService } from "@/services/notification.service";
import type { NotificationResponse } from "@/interfaces/notification-api.interface";
import { cn } from "@/lib/utils";
import { onNotificationRefresh } from "@/lib/notification-events";
import { playNotificationChime } from "@/lib/notification-sound";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { usePersona } from "@/hooks/use-persona";

/**
 * Click-to-toggle popover (same pattern as ProfileMenu) showing recent
 * notifications, with an unread-count badge. Polls every 30s since there's
 * no push channel yet - good enough at this scale, a websocket/SSE push can
 * replace the poll later without changing anything that reads this data.
 */
export function NotificationBell() {
  const { isOrganizerOnly, isDualRole, activePersona } = usePersona();
  const isOrganizerView = isOrganizerOnly || (isDualRole && activePersona === "organizer");
  const audience = isOrganizerView ? "ORGANIZER" : "USER";
  const viewAllHref = isOrganizerView ? "/dashboard/notifications" : "/user/dashboard/orders";
  const viewAllLabel = isOrganizerView ? "View all notifications" : "View all orders";

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousUnreadCount = useRef(0);
  const hasLoadedOnce = useRef(false);

  const refreshUnreadCount = useCallback(() => {
    notificationService
      .unreadCount(audience)
      .then((result) => {
        // Only chime once we've established a baseline - otherwise the very
        // first load (going from "unknown" to e.g. 3) would chime for
        // notifications the user never actually saw arrive.
        if (hasLoadedOnce.current && result.count > previousUnreadCount.current) {
          playNotificationChime();
        }
        hasLoadedOnce.current = true;
        previousUnreadCount.current = result.count;
        setUnreadCount(result.count);
      })
      .catch(() => {
        // Not signal-worthy to the user - the badge just stays at its last known count.
      });
  }, [audience]);

  useEffect(() => {
    // Persona can flip (dual-role switch) while this component stays mounted -
    // reset the chime baseline so switching context never misfires a chime by
    // comparing an unread count from one audience against the other's.
    hasLoadedOnce.current = false;
  }, [audience]);

  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 30_000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  useEffect(() => {
    // The notification itself lands asynchronously via Kafka after an action
    // like a booking, so one immediate check plus a couple of short-delay
    // retries catches it well before the next scheduled poll would.
    return onNotificationRefresh(() => {
      refreshUnreadCount();
      const retry1 = setTimeout(refreshUnreadCount, 3_000);
      const retry2 = setTimeout(refreshUnreadCount, 8_000);
      return () => {
        clearTimeout(retry1);
        clearTimeout(retry2);
      };
    });
  }, [refreshUnreadCount]);

  useEffect(() => {
    if (!isOpen) return;
    notificationService.myNotifications(audience, 0, 10).then((result) => setNotifications(result.items));
  }, [isOpen, audience]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleMarkRead(notification: NotificationResponse) {
    if (notification.read) return;
    notificationService.markRead(notification.id).then(() => {
      setNotifications((current) => current.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
      setUnreadCount((current) => Math.max(0, current - 1));
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand"
      >
        <Bell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-2xl border border-line bg-surface p-1.5 shadow-lg">
          <div className="border-b border-line px-3 py-2.5">
            <p className="text-sm font-semibold text-ink">Notifications</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-ink-muted">You&apos;re all caught up.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleMarkRead(notification)}
                  className={cn(
                    "flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition hover:bg-surface-hover",
                    !notification.read && "bg-brand/5",
                  )}
                >
                  <p className="text-sm font-semibold text-ink">{notification.title}</p>
                  <p className="text-xs text-ink-muted">{notification.message}</p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">{formatRelativeTime(notification.createdAt)}</p>
                </button>
              ))
            )}
          </div>
          <Link
            href={viewAllHref}
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-center text-xs font-semibold text-brand transition hover:bg-surface-hover"
          >
            {viewAllLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
