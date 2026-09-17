/**
 * band.js
 * -------
 * Core band info, social links, and the Home/Bio page images & text —
 * used across the whole site (Navbar, Footer, Home hero, Bio page,
 * Contact page, etc).
 *
 * The actual data lives in `src/content/site.json` — that's the file
 * the admin panel (see README.md → "Managing content with the admin
 * panel") edits directly, under "Site Settings". This file just imports
 * that JSON and re-exports each section, so every page that uses
 * `band`/`socialLinks`/`home`/`bio` doesn't need to know or care that
 * the data comes from the admin panel now instead of being hand-written
 * here. You can still edit `src/content/site.json` by hand instead of
 * using the admin panel if you'd rather — it's a plain JSON file.
 *
 *   band        - name, tagline (shown in the Home hero), location,
 *                 contact email, optional booking email
 *   socialLinks - Instagram/TikTok/YouTube/Spotify URLs for
 *                 <SocialLinks /> (footer, Contact page). Leave a value
 *                 blank to hide that platform's link without breaking
 *                 anything that reads this object.
 *   home        - the Home page hero photo + its alt text
 *   bio         - the Bio page's band portrait photo + alt text, plus
 *                 the bio story paragraphs (as a list — one entry per
 *                 paragraph)
 */
import site from '../content/site.json';

export const band = site.band;
export const socialLinks = site.socialLinks;
export const home = site.home;
export const bio = site.bio;
