/**
 * shows.ts
 * --------
 * Show/tour dates, rendered by the Shows page (and the "next show" teaser
 * on Home).
 *
 * The actual data lives in `src/content/shows.json` — that's the file
 * the admin panel (see README.md → "Managing content with the admin
 * panel") edits directly. This file just imports that JSON, adds an
 * auto-generated `id` to each show, and re-exports it — so every page
 * that uses `shows` doesn't need to know or care that the data comes
 * from the admin panel now instead of being hand-written here.
 *
 * You can still edit `src/content/shows.json` by hand instead of using
 * the admin panel if you'd rather — it's a plain JSON file.
 *
 * The Shows page automatically sorts these by date and splits them into
 * "Upcoming" / "Past" sections, so you don't need to keep this list in
 * order yourself.
 *
 * Fields (set per show in the admin panel, or by hand in shows.json):
 *   date        - 'YYYY-MM-DD' (ISO format sorts/parses correctly)
 *   venue       - venue name
 *   city        - city name
 *   state       - state/region abbreviation
 *   ticketUrl   - link to an actual ticket-purchase page. Most DIY/house
 *                 shows won't have one of these — leave it blank if so.
 *   infoUrl     - fallback link for shows with no ticket site: a
 *                 Facebook/Instagram event post, the venue's page,
 *                 wherever people can find the details. Only used when
 *                 `ticketUrl` is blank. Leave both blank if you don't
 *                 have anything to link to yet — the show just shows
 *                 "Event Info Coming Soon" instead of a button.
 *   soldOut     - true/false, shows a "SOLD OUT" badge instead of a
 *                 ticketUrl/infoUrl button
 *   supportedBy - optional list of other band names on the bill
 *
 * The button shown for each upcoming show follows this order: sold out
 * badge > "Tickets" (ticketUrl) > "Event Info" (infoUrl) > "Event Info
 * Coming Soon" text (neither is set yet). Past shows never show a
 * button at all.
 */
import data from '../content/shows.json';
import { slugify } from '../utils/slugify';
import type { RawShow, Show } from '../types/content';

export const shows: Show[] = data.shows.map(
  (show: RawShow): Show => ({
    ...show,
    // Auto-generated from date + venue, e.g. '2026-07-26-century-bar' —
    // just needs to be unique per show, used internally by React to
    // tell list items apart. Nobody has to type this in the admin panel.
    id: `${show.date}-${slugify(show.venue)}`,
  }),
);
