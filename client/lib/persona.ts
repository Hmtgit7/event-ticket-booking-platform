export type Persona = "organizer" | "user";

const CHANNEL_NAME = "gmt-persona-sync";
let channel: BroadcastChannel | null = null;

/** Lazily created - BroadcastChannel doesn't exist during SSR. */
function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

/**
 * Cross-tab instant relay for persona changes. This is NOT the source of
 * truth - that's the server (auth-service's User.activePersona, synced into
 * useAuthStore's user.activePersona on login/hydrate). This exists purely so
 * that after one tab successfully persists a switch via the API, every other
 * open tab finds out immediately instead of waiting for its next request.
 */
export const personaBroadcast = {
  /** Call after the API call that persists the switch has already succeeded. */
  announce: (persona: Persona) => {
    getChannel()?.postMessage(persona);
  },

  /** Notify on every announced change, from this tab or any other. Returns an unsubscribe function. */
  subscribe: (callback: (persona: Persona) => void): (() => void) => {
    const bc = getChannel();
    if (!bc) return () => {};
    function handleMessage(event: MessageEvent<Persona>) {
      callback(event.data);
    }
    bc.addEventListener("message", handleMessage);
    return () => bc.removeEventListener("message", handleMessage);
  },
};
