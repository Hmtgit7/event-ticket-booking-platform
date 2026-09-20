import type { StoredLocation } from "@/lib/location-storage";

const REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
const IP_GEOLOCATION_URL = "https://ipapi.co/json/";
const GEOLOCATION_TIMEOUT_MS = 8000;
const GEOLOCATION_MAX_AGE_MS = 5 * 60 * 1000;

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function detectLanguage(): string {
  return typeof navigator !== "undefined" && navigator.language ? navigator.language : "en";
}

/**
 * Country via IP - coarser than geolocation (city-level at best, often
 * just region), but needs no permission prompt at all. Used as the
 * fallback when geolocation is denied/unsupported, and as the only lookup
 * when the person dismisses the permission modal outright. Best-effort:
 * a network hiccup or ad-blocker just means country stays null and the
 * person can still set it manually via the topbar country switcher.
 */
async function resolveCountryByIp(): Promise<string | null> {
  try {
    const res = await fetch(IP_GEOLOCATION_URL);
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.country_code === "string" ? data.country_code : null;
  } catch {
    return null;
  }
}

async function resolveCountryByCoords(latitude: number, longitude: number): Promise<string | null> {
  try {
    const res = await fetch(
      `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.countryCode === "string" ? data.countryCode : null;
  } catch {
    return null;
  }
}

function getCurrentPosition(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => resolve(null), // denied, timed out, or position unavailable - all treated the same, fall back to IP
      { timeout: GEOLOCATION_TIMEOUT_MS, maximumAge: GEOLOCATION_MAX_AGE_MS },
    );
  });
}

/**
 * Called after the person taps "Allow" on the permission modal. timezone
 * and language never need permission - Intl and navigator.language are
 * always available regardless of what happens with geolocation.
 */
export async function resolveWithGeolocation(): Promise<StoredLocation> {
  const position = await getCurrentPosition();
  const country = position
    ? await resolveCountryByCoords(position.coords.latitude, position.coords.longitude)
    : await resolveCountryByIp(); // browser prompted but the OS/user still blocked it - don't come back empty-handed

  return { country, timezone: detectTimezone(), language: detectLanguage() };
}

/** Called after "Not now" - no geolocation prompt at all, IP-based country only. */
export async function resolveWithoutGeolocation(): Promise<StoredLocation> {
  const country = await resolveCountryByIp();
  return { country, timezone: detectTimezone(), language: detectLanguage() };
}
