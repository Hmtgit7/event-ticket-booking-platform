export const SUPPORTED_LOCALES = ["en", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/**
 * Maps a BCP-47 language tag (whatever the resolved location/preferences
 * system hands us - "en", "en-US", "es-419") down to one of our supported
 * locales, via its primary subtag. Anything unsupported falls back to
 * DEFAULT_LOCALE rather than failing - a missing translation bundle is
 * never a reason to break the page.
 */
export function resolveSupportedLocale(rawLanguage: string | null | undefined): Locale {
  const primary = (rawLanguage ?? "").split("-")[0].toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(primary) ? (primary as Locale) : DEFAULT_LOCALE;
}
