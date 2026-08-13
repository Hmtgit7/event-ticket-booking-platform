"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionTitle } from "./section-title";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { notificationService } from "@/services/notification.service";
import type { NotificationResponse } from "@/interfaces/notification-api.interface";
import { NavRoute } from "@/enums/nav-route.enum";

const PREVIEW_COUNT = 4;

/**
 * Renders the "What needs attention" notifications panel on the overview
 * page. Real data from notification-service, scoped to the signed-in
 * user's USER-audience inbox - same source as the bell and the full
 * /user/dashboard/notifications page, just capped to a short preview.
 */
export function NotificationList() {
  const [items, setItems] = useState<NotificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    notificationService
      .myNotifications("USER", 0, PREVIEW_COUNT)
      .then((result) => {
        if (!cancelled) setItems(result.items);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <article className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <SectionTitle eyebrow="Updates" title="What needs attention" />
        <Link
          href={NavRoute.UserNotifications}
          className="shrink-0 text-xs font-semibold text-brand hover:underline"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-line bg-background px-4 py-6 text-center text-sm text-ink-muted">
          You&apos;re all caught up.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-line bg-background px-4 py-3 text-sm text-ink"
            >
              <div className="flex items-start justify-between gap-2">
                <p className={item.read ? "text-ink-muted" : "font-semibold text-ink"}>{item.title}</p>
                <span className="shrink-0 text-xs text-ink-muted">{formatRelativeTime(item.createdAt)}</span>
              </div>
              <p className="mt-0.5 text-xs text-ink-muted">{item.message}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
