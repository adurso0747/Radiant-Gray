/**
 * releases.js
 * -----------
 * Music releases (albums/EPs/singles), rendered by the Music page (and the
 * "latest release" teaser on Home).
 *
 * The actual data lives in `src/content/releases.json` — that's the file
 * the admin panel (see README.md → "Managing content with the admin
 * panel") edits directly. This file just imports that JSON, adds an
 * auto-generated `id` to each release, and re-exports it. You can still
 * edit `src/content/releases.json` by hand instead of using the admin
 * panel if you'd rather — it's a plain JSON file.
 *
 * The Music page renders this list in the order it's written in
 * releases.json, so put your newest release first there.
 *
 * Fields:
 *   title         - release title
 *   type          - 'Album' | 'EP' | 'Single' (just a display label)
 *   year          - release year, as a number
 *   coverImage    - cover art image path (set via the admin panel's
 *                   image upload, or point it at a file you've dropped
 *                   in public/images/releases/ yourself)
 *   coverAlt      - alt text describing the cover art
 *   streamingUrl  - "Listen" link, e.g. Spotify/Apple Music. Leave blank
 *                   if a release is Bandcamp-only — the Listen button is
 *                   hidden when this is blank.
 *   bandcampUrl   - "Bandcamp" link; leave blank to hide it. At least
 *                   one of streamingUrl/bandcampUrl should be set, or
 *                   the release shows "Coming Soon" instead of a button.
 */
import data from '../content/releases.json';
import { slugify } from '../utils/slugify';

export const releases = data.releases.map((release) => ({
  ...release,
  // Auto-generated from the title, e.g. 'my-fatal-flaw' — just needs to
  // be unique per release, used internally by React to tell list items
  // apart. Nobody has to type this in the admin panel.
  id: slugify(release.title),
}));
