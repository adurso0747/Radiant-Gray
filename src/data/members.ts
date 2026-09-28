/**
 * members.ts
 * ----------
 * Band member roster, rendered by the Bio page.
 *
 * The actual data lives in `src/content/members.json` — that's the file
 * the admin panel (see README.md → "Managing content with the admin
 * panel") edits directly. This file just imports that JSON, adds an
 * auto-generated `id` to each member, and re-exports it. You can still
 * edit `src/content/members.json` by hand instead of using the admin
 * panel if you'd rather — it's a plain JSON file.
 *
 * `photo` points at a file in `public/images/members/` — anything in
 * `public/` is served from the site root, so `/images/members/x.jpg`
 * maps to the file at `public/images/members/x.jpg`. See
 * `public/images/README.md` for more on how that folder works.
 */
import data from '../content/members.json';
import { slugify } from '../utils/slugify';
import type { RawMember, Member } from '../types/content';

export const members: Member[] = data.members.map(
  (member: RawMember): Member => ({
    ...member,
    // Auto-generated from the name, e.g. 'jared' — just needs to be
    // unique per member, used internally by React to tell list items
    // apart. Nobody has to type this in the admin panel.
    id: slugify(member.name),
  }),
);
