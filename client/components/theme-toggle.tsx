"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

/**
 * React 19-friendly mounted hook.
 * Avoids useEffect + setState while still preventing hydration mismatch.
 */
function useMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Light / Dark / System theme toggle.
 * Cycles: light → dark → system.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  // Prevent hydration mismatch until mounted.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        suppressHydrationWarning
        className="h-10 w-10 rounded-full border border-line bg-surface"
      />
    );
  }

  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Theme: ${theme} (click for ${nextTheme})`}
      suppressHydrationWarning
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
    >
      {theme === "dark" ? (
        <Moon size={18} />
      ) : theme === "light" ? (
        <Sun size={18} />
      ) : (
        <Monitor size={18} />
      )}
    </button>
  );
}
