/**
 * Lightweight cross-component signal for "something just happened that
 * might create a notification" (e.g. a booking succeeded). NotificationBell
 * listens for this to refetch its unread count immediately instead of
 * waiting on its 30s poll. Deliberately a plain window event, not a state
 * library - this is a one-off fire-and-forget signal, not shared state.
 */
const NOTIFICATION_REFRESH_EVENT = "notifications:refresh";

export function triggerNotificationRefresh() {
  window.dispatchEvent(new Event(NOTIFICATION_REFRESH_EVENT));
}

export function onNotificationRefresh(handler: () => void): () => void {
  window.addEventListener(NOTIFICATION_REFRESH_EVENT, handler);
  return () => window.removeEventListener(NOTIFICATION_REFRESH_EVENT, handler);
}
