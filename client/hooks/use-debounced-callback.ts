"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Generic debounce hook: returns a debounced version of `callback` that
 * only fires `delayMs` after the last call, plus a `cancel` to drop any
 * pending invocation early. Not tied to search or the topbar - reusable
 * anywhere something needs debouncing (search-as-you-type, filters,
 * autosave, resize handlers, etc).
 *
 * All state lives in refs, not React state, so this hook never calls
 * setState itself - callers are free to setState from within `callback`
 * without tripping react-hooks/set-state-in-effect.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the ref pointed at the latest closure on every render, without
  // recreating the debounced function (and losing a pending timer) each
  // time the caller re-renders with a new inline callback.
  useEffect(() => {
    callbackRef.current = callback;
  });

  // Unmount cleanup only - no setState here, just clearing a timer.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const debounced = useCallback(
    (...args: Args) => {
      cancel();
      timerRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
    },
    [cancel, delayMs],
  );

  return { debounced, cancel };
}
