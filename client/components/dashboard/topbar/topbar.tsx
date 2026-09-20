"use client";

import { useEffect, useRef } from "react";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { useTopbarSearch } from "@/hooks/use-topbar-search";
import { PendingDeletionBanner } from "@/components/dashboard/pending-deletion-banner";
import { CountrySwitcher } from "./country-switcher";
import { SearchResultsDropdown } from "./search-results-dropdown";
import { ProfileMenu } from "./profile-menu";
import { NotificationBell } from "./notification-bell";

interface DashboardTopbarProps {
  section: string;
  crumb: string;
  /** Where the avatar menu's "Profile settings" link goes. Each shell
   * passes its own persona's settings entry point — never share this
   * across shells, or one persona's menu will land on another
   * persona's settings (this was a real bug: all three shells used to
   * hardcode the organizer's /dashboard/settings route). */
  settingsHref: string;
  /** Event keyword search only makes sense for the customer-facing user
   * dashboard - organizer and admin topbars render without it. Defaults
   * to off so existing shells don't need to change. */
  showSearch?: boolean;
}

/** Sticky top bar: breadcrumb + search on the left, quick actions (theme
 * toggle, messages, notifications) and the signed-in user on the right.
 * `section`/`crumb` come from the route so this stays a dumb, reusable
 * shell shared by every dashboard page. */
export function DashboardTopbar({ section, crumb, settingsHref, showSearch = false }: DashboardTopbarProps) {
  const { toggle } = useSidebar();
  const { query, setQuery, results, loading, open, setOpen, reset } = useTopbarSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSearch) return;
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch, setOpen]);

  return (
    <>
    <header className="sticky top-0 z-30 flex shrink-0 items-center gap-4 rounded-[28px] bg-surface/95 px-4 py-3.5 shadow-sm backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle sidebar"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink lg:hidden"
      >
        <Menu className="size-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-ink-muted">{section}</p>
        <h1 className="truncate text-xl font-bold text-ink">{crumb}</h1>
      </div>

      {showSearch && (
        <div ref={searchRef} className="relative hidden max-w-sm flex-1 md:block">
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-ink-muted">
            <Search className="size-4" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => query.trim().length >= 2 && setOpen(true)}
              placeholder="Search events by name or city"
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </div>
          {open && <SearchResultsDropdown query={query} results={results} loading={loading} onSelect={reset} />}
        </div>
      )}

      <div className="flex shrink-0 items-center gap-2">
        <CountrySwitcher />
        <ThemeToggle />
        {/* <IconButton icon={Mail} label="Messages" /> */}
        <NotificationBell />
        <ProfileMenu settingsHref={settingsHref} />
      </div>
    </header>
    <PendingDeletionBanner />
    </>
  );
}
