/**
 * content.ts
 * ----------
 * Shapes of the content in `src/content/*.json`, and what the
 * `src/data/*.ts` wrapper files actually export — each list item gets an
 * auto-generated `id` added (see `src/utils/slugify.ts`) on top of
 * whatever's in the JSON.
 *
 * These interfaces describe the JSON's structure, not the app's routing
 * or components — see each `src/content/*.json` file's matching
 * `src/data/*.ts` wrapper for what edits what.
 */

export interface Band {
  name: string;
  tagline: string;
  location: string;
  email: string;
  bookingEmail: string | null;
}

export interface SocialLinks {
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  spotify: string | null;
}

export interface HomeContent {
  heroImage: string;
  heroImageAlt: string;
  latestVideoUrl: string | null;
  latestVideoTitle: string | null;
}

export interface BioContent {
  portraitImage: string;
  portraitImageAlt: string;
  paragraphs: string[];
}

export interface RawShow {
  date: string; // 'YYYY-MM-DD'
  venue: string;
  city: string;
  state: string;
  // Street address, e.g. '2580 Haverford Rd, Ardmore, PA 19003' — shown
  // as a "Directions" link to Google Maps when set (see
  // src/utils/maps.ts). Independent of ticketUrl/infoUrl below; a show
  // can have both a ticket link and an address.
  address: string | null;
  // Free-form, e.g. 'Doors 7pm, Show 8pm' or '8:00 PM'. Shown whenever
  // set, as a link to add the show to Google Calendar (see
  // src/utils/calendar.ts) — independent of ticketUrl/infoUrl/address.
  time: string | null;
  ticketUrl: string | null;
  infoUrl: string | null;
  soldOut: boolean;
  supportedBy: string[];
}
export type Show = RawShow & { id: string };

export interface RawRelease {
  title: string;
  // Free-form display label — the admin panel's dropdown constrains
  // this to 'Album' | 'EP' | 'Single', but nothing at this layer
  // enforces it, since the underlying content is just JSON.
  type: string;
  year: number;
  coverImage: string;
  coverAlt: string;
  streamingUrl: string | null;
  bandcampUrl: string | null;
}
export type Release = RawRelease & { id: string };

export interface RawMerchItem {
  name: string;
  price: string;
  category: string;
  image: string | null;
  imageAlt: string;
  buyUrl: string | null;
  soldOut: boolean;
}
export type MerchItem = RawMerchItem & { id: string };

export interface RawMember {
  name: string;
  instrument: string;
  photo: string;
  photoAlt: string;
}
export type Member = RawMember & { id: string };
