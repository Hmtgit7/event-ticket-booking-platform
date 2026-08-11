/**
 * Plays the notification chime asset. Must live under public/ for Next.js to
 * serve it at a fetchable URL - see the note in this file's history if that
 * path ever needs to change.
 */
const CHIME_URL = "/audio/notification-audio.mp3";

let cachedAudio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!cachedAudio) {
    cachedAudio = new Audio(CHIME_URL);
    cachedAudio.volume = 0.5;
  }
  return cachedAudio;
}

export function playNotificationChime() {
  try {
    const audio = getAudio();
    // Rewind first: back-to-back notifications (bulk booking activity) should
    // each get a fresh chime instead of silently no-op'ing on an in-flight one.
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Autoplay policies (no prior user interaction on the page yet) can
      // block this - a missed chime isn't worth surfacing an error over,
      // the badge count still updates regardless.
    });
  } catch {
    // Unsupported browser/environment - same reasoning as above.
  }
}
