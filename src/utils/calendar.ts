/**
 * calendar.ts
 * -----------
 * Builds a Google Calendar "add event" link for a show — no API key, no
 * extra dependency, same approach as maps.ts. Uses an all-day event on
 * the show's date rather than trying to parse an exact start/end time
 * out of `show.time`, since that field is free-form for display (e.g.
 * 'Doors 7pm, Show 8pm') and not reliably parseable into a precise
 * clock time or timezone. The free-form text itself is carried over
 * into the event's details instead, so nothing is lost.
 */
import type { RawShow } from '../types/content';

export function getCalendarUrl(show: Pick<RawShow, 'date' | 'venue' | 'city' | 'state' | 'address' | 'time'>): string {
  const start = new Date(`${show.date}T00:00:00Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const toCompactDate = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Radiant Gray at ${show.venue}`,
    dates: `${toCompactDate(start)}/${toCompactDate(end)}`,
    location: show.address ?? `${show.venue}, ${show.city}, ${show.state}`,
  });

  if (show.time) {
    params.set('details', `Time: ${show.time}`);
  }

  return `https://www.google.com/calendar/render?${params.toString()}`;
}
