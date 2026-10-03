/**
 * maps.ts
 * -------
 * Turns a plain street address into a Google Maps link — no API key, no
 * extra dependency. Uses Google's documented "Universal Maps URL"
 * format (https://developers.google.com/maps/documentation/urls),
 * which works the same way a shared Google Maps link does: on a phone
 * with the Maps app installed, it opens there; otherwise it opens
 * Google Maps in the browser.
 */
export function getMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
