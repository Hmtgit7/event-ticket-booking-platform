"use client";

import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/common/avatar";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/modules/auth/hooks/use-logout";

/** Click-to-toggle popover (closes on outside click / Escape) showing the
 * signed-in user's name + email, with links to settings and logout. */
export function ProfileMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const displayName = user?.fullName || user?.email?.split("@")[0] || "Account";
  const displayEmail = user?.email ?? "";

  return (
    <div ref={containerRef} className="relative ml-1 hidden sm:block">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-full p-1 outline-none transition hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-brand/25"
      >
        <Avatar name={displayName} className="size-10" />
        <div className="min-w-0 max-w-[160px] text-left leading-tight">
          <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
          <p className="truncate text-xs text-ink-muted">{displayEmail}</p>
        </div>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-line bg-surface p-1.5 shadow-lg">
          <div className="border-b border-line px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
            <p className="truncate text-xs text-ink-muted">{displayEmail}</p>
          </div>
          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-hover"
          >
            <Settings className="size-4" aria-hidden="true" />
            Profile settings
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
