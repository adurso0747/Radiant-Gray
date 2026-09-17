/**
 * merch.js
 * --------
 * Merch items — NOT currently rendered anywhere. The Merch page
 * (`src/pages/Merch.jsx`) is a simple "coming soon" placeholder for now
 * since there's no real merch to sell yet. This file (and the admin
 * panel's "Merch" section) is left here, ready to go, for whenever that
 * changes — see the comment at the top of Merch.jsx for how to wire it
 * back in.
 *
 * The actual data lives in `src/content/merch.json` — that's the file
 * the admin panel (see README.md → "Managing content with the admin
 * panel") edits directly. This file just imports that JSON, adds an
 * auto-generated `id` to each item, and re-exports it. You can still
 * edit `src/content/merch.json` by hand instead of using the admin
 * panel if you'd rather — it's a plain JSON file.
 *
 * This site doesn't include a shopping cart/checkout (that needs a real
 * backend) — each item just links out to wherever you actually sell it:
 * Bandcamp, Shopify, Big Cartel, a merch table Venmo, etc.
 *
 * Fields:
 *   name      - item name
 *   price     - display string, e.g. '$20' (kept as a string so you can
 *               write '$20+' or '€18' etc without extra formatting code)
 *   category  - 'Shirt' | 'Vinyl' | 'Tape' | 'Poster' | ... any label you
 *               want, it's just displayed as-is
 *   image     - product photo (set via the admin panel's image upload)
 *   imageAlt  - alt text describing the product photo
 *   buyUrl    - link to buy this item; leave blank if not for sale yet
 *   soldOut   - true/false, shows a "SOLD OUT" badge and disables the
 *               buy button
 */
import data from '../content/merch.json';
import { slugify } from '../utils/slugify';

export const merchItems = data.merchItems.map((item) => ({
  ...item,
  // Auto-generated from the name, e.g. 'porchlight-tour-tee' — just
  // needs to be unique per item, used internally by React to tell list
  // items apart. Nobody has to type this in the admin panel.
  id: slugify(item.name),
}));
