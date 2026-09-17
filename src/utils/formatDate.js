/**
 * formatDate.js
 * -------------
 * Small date helpers shared by the Home and Shows pages, so both format
 * show dates the same way and we're not repeating this logic.
 */

/**
 * Turns a 'YYYY-MM-DD' string into something like "OCT 3, 2026".
 *
 * Note: we append 'T00:00:00' before parsing so the browser treats the
 * date as local time. Without it, `new Date('2026-10-03')` is parsed as
 * UTC midnight, which can display as the *previous* day for anyone west
 * of UTC — a classic JS date gotcha.
 */
export function formatShowDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase();
}

/** True if the given 'YYYY-MM-DD' date is today or in the future. */
export function isUpcoming(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${isoDate}T00:00:00`) >= today;
}
