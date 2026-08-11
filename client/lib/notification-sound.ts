/**
 * Synthesized notification chime via Web Audio API - no audio asset file
 * needed (nothing to fail to load, nothing to add to the repo). A short
 * two-tone "ding", not a sound loop.
 */
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    [880, 1318.5].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      const start = now + index * 0.09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.3);
    });

    setTimeout(() => ctx.close(), 600);
  } catch {
    // Autoplay policies or an unsupported browser can block this - a missed
    // chime is not worth surfacing an error over, the badge count still updates.
  }
}
