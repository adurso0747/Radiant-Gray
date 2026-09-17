# Adding your own images

This folder is for real photos/art. `hero.jpg`, `bio-portrait.jpg`,
`members/*.jpg`, and `releases/*.jpg` are already filled in (see the
Home, Bio, and Music pages) — Merch is the only content without photos,
since the Merch page is currently a "coming soon" placeholder with no
items shown at all (see the note in the main
[README.md](../../README.md)).

## The easy way: the admin panel

The site has a built-in admin panel at `/admin` for editing content
(shows, releases, merch, band members, and these photos) without
touching any files directly — see the main README's **"Managing
content with the admin panel"** section. Every image field there
(hero photo, band portraits, cover art, etc.) lets you upload a file
straight from your computer or phone, and it lands in the right place
in this folder automatically.

## The manual way

If you'd rather just replace a file directly instead of using the admin
panel:

- **Replacing an existing photo** (hero, bio portrait, a member's
  photo, a release's cover art): just overwrite the file at its current
  path with your new image, keeping the same filename — nothing else
  needs to change, since the pages already point at that path.
- **Adding a photo for something new** (e.g. the first Merch item, or a
  new band member): drop the file in the relevant subfolder here, then
  point the matching entry in `src/content/*.json` at it, e.g.
  `"photo": "/images/members/new-name.jpg"`. Anything inside `public/`
  is served as-is at the site root, so `public/images/foo.jpg` becomes
  available at the URL `/images/foo.jpg`. See the main README's
  "Editing content" section for which JSON file holds what.

Once you have real merch to sell and turn that page on (see the comment
at the top of `src/pages/Merch.jsx`), it'll read each item's `image`
field from `src/content/merch.json` and render a real `<img>` the same
way Music/Bio/Members already do — just drop the photos in
`public/images/merch/` (or upload them through the admin panel) first.

Whichever way you add a photo, keep its `alt`/description text real and
descriptive — it's what screen readers read aloud and what shows up if
the image fails to load. Every image field in the admin panel and every
`*Alt` field in `src/content/*.json` is that description.

A few suggested filenames/locations, matching what's already there:

- `hero.jpg` — Home page banner
- `bio-portrait.jpg` — Bio page group photo
- `members/<name>.jpg` — individual member photos
- `releases/<release-id>.jpg` — album/EP/single cover art
- `merch/<item-id>.jpg` — product photos

## Image size tips

- Keep photos reasonably sized for the web (roughly 1500-2000px on the
  longest side is plenty for a full-width hero image) and compressed
  (JPEG quality ~75-85%, or convert to `.webp`) — large, uncompressed
  photos are the most common cause of a slow-loading band site. A
  modern phone photo can easily be 10-20MB straight out of the camera;
  resize it down first. Free tools like [Squoosh](https://squoosh.app/)
  do this entirely in your browser, no software to install.
- The admin panel does **not** resize or compress uploads for you — see
  the note above.
