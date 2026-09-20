/**
 * ISO 3166-1 alpha-2 -> flag emoji, via Unicode regional indicator symbols
 * (each letter A-Z maps to U+1F1E6..U+1F1FF, offset +127397 from its ASCII
 * code point). No image assets, no network request, renders natively on
 * every platform that has emoji font support at all - this is how every
 * major site (Booking.com, Notion, etc.) does a flag-plus-country picker
 * without shipping a spritesheet.
 */
export function countryCodeToFlagEmoji(countryCode: string): string {
  if (!/^[A-Za-z]{2}$/.test(countryCode)) return "🏳️";

  const codePoints = [...countryCode.toUpperCase()].map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
