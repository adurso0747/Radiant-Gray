/**
 * slugify.ts
 * ----------
 * Turns text into a URL/key-safe "slug" — lowercase, spaces and
 * punctuation replaced with hyphens. Used to auto-generate stable `id`
 * values (for React's `key` prop) from content edited in the admin
 * panel, so nobody has to type an ID by hand — see the comment at the
 * top of `src/data/shows.ts` for why.
 *
 * slugify('My Fatal Flaw') -> 'my-fatal-flaw'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // any run of non-alphanumeric chars -> one hyphen
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}
