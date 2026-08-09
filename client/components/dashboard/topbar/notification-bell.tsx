"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { notificationService } from "@/services/notification.service";
import type { NotificationResponse } from "@/interfaces/notification-api.interface";
import { cn } from "@/lib/utils";

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/**
 * Click-to-toggle popover (same pattern as ProfileMenu) showing recent
 * notifications, with an unread-count badge. Polls every 30s since there's
 * no push channel yet - good enough at this scale, a websocket/SSE push can
 * replace the poll later without changing anything that reads this data.
 */
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function refreshUnreadCount() {
      notificationService
        .unreadCount()
        .then((result) => setUnreadCount(result.count))
        .catch(() => {
          // Not signal-worthy to the user - the badge just stays at its last known count.
        });
    }
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    notificationService.myNotifications(0, 10).then((result) => setNotifications(result.items));
  }, [isOpen]);

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
            href="/user/dashboard/orders"
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-center text-xs font-semibold text-brand transition hover:bg-surface-hover"
          >
            View all orders
          </Link>
        </div>
      ) : null}
    </div>
  );
}
