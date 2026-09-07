# Radiant Gray

The official website for Radiant Gray — built with [React](https://react.dev/)
and [Vite](https://vite.dev/). This README covers how to run the site
locally, how the project is organized, how to edit content, and how to
deploy it.

No AI-generated artwork is used anywhere in this project. Every spot
that needs a real photo currently shows a labeled placeholder box — see
[Adding your own images](#adding-your-own-images) below.

## Getting started

You'll need [Node.js](https://nodejs.org/) installed (LTS version is
fine). Then, from this folder:

```bash
npm install
npm run dev
```

This starts a local dev server (Vite will print the URL, usually
`http://localhost:5173`) that automatically reloads as you edit files.

Other commands:

```bash
npm run build    # builds a production-ready copy into dist/
npm run preview  # locally preview that production build
npm run lint      # runs oxlint over the source for common mistakes
```

## Project structure

```
public/
  favicon.svg       — browser tab icon (a simple placeholder monogram)
  images/           — put your real photos here (see below); empty by default
index.html          — the single HTML page; loads fonts and src/main.jsx
src/
  main.jsx          — entry point, mounts <App /> into index.html
  App.jsx           — sets up page routing + shared layout (Navbar/Footer)
  styles/
    global.css      — design tokens (colors/fonts/spacing) + base styles
  components/       — small reusable pieces used across pages
    Navbar.jsx / .css
    Footer.jsx / .css
    SocialLinks.jsx / .css   — icon links, see "Social icons" below
    ImagePlaceholder.jsx / .css
    icons/
      MoonMark.jsx    — small decorative crescent-moon brand glyph
  pages/            — one file per site page, each with a matching .css
    Home.jsx / .css
    Bio.jsx / .css
    Shows.jsx / .css
    Music.jsx / .css
    Merch.jsx / .css
    Contact.jsx / .css
    NotFound.jsx / .css   — shown for any unknown URL
  data/             — plain content, no JSX — edit these to update the site
    band.js         — band name, tagline, contact email, social links
    shows.js         — show/tour dates
    releases.js       — albums/EPs/singles
    merch.js         — merch catalog
    members.js       — band member roster
  hooks/
    usePageTitle.js  — small custom hook that sets the browser tab title
  utils/
    formatDate.js    — shared date-formatting helpers
```

Every `.jsx` file has comments at the top explaining what it does — the
`data/` files are the best starting point since editing them changes the
site without touching any component code.

## Editing content

Most day-to-day updates (a new show, a new release, a merch item) don't
require touching any component/page code — just edit the relevant file
in `src/data/`:

- **Band info & social links** → `src/data/band.js`
- **Shows** → `src/data/shows.js` (automatically sorted into
  Upcoming/Past on the Shows page based on today's date)
- **Music releases** → `src/data/releases.js` (newest first)
- **Merch** → `src/data/merch.js` (not wired up yet — the Merch page is
  currently a "coming soon" placeholder since there's nothing to sell.
  See the comment at the top of `src/pages/Merch.jsx` for how to turn
  it into a real catalog page once you have merch.)
- **Band members** → `src/data/members.js`

Each of these files has comments describing every field.

To change the actual page layout/copy (the Bio page's story text, the
Home page's hero, etc.), edit the corresponding file in `src/pages/`.

## Adding your own images

No images are included in this project — every photo spot currently
renders an `<ImagePlaceholder />` component (a dashed box with a label
describing what goes there and a recommended size). See
[`public/images/README.md`](public/images/README.md) for the exact
steps to swap a placeholder for a real `<img>`.

## Fonts

The site loads two Google Fonts via `<link>` tags in `index.html`:
**Montserrat** (headings — used uppercase and letter-spaced for a
wordmark/logo feel) and **Space Mono** (nav, labels, body text). To
change the look, either:

- Swap the Google Fonts URL in `index.html` for different font
  families, and update `--font-display` / `--font-mono` in
  `src/styles/global.css` to match, or
- Self-host fonts instead (better for privacy/offline builds): download
  the font files, put them in `public/fonts/`, add `@font-face` rules to
  `src/styles/global.css`, and remove the Google Fonts `<link>` tags
  from `index.html`.

## Colors & theme

The current look is a dark, atmospheric "night sky" theme (deep teal
background, warm crescent-moon gold accent, off-white "moonlight" text,
plus a subtle grain texture) based on the band's cover art. All colors,
fonts, and spacing are defined as CSS custom properties (variables) at
the top of `src/styles/global.css` under the "DESIGN TOKENS" comment.
Changing a value there updates it everywhere it's used across the site —
that's the one place to go to reskin the whole site.

The small crescent-moon glyph next to the wordmark (`src/components/icons/MoonMark.jsx`)
and the film-grain overlay (`body::after` in `global.css`) are both a
nod to that cover art, generated in CSS/SVG rather than using the actual
photo.

## Social icons

The Instagram/TikTok/YouTube/Spotify links (`src/components/SocialLinks.jsx`)
use real brand icons from the [`react-icons`](https://react-icons.github.io/react-icons/)
package (its "Simple Icons" set), so it's obvious at a glance which
platform each link goes to. They render in a single color matching the
site's theme rather than each brand's official multicolor style — see
the comment at the top of that file if you'd rather add more platforms
or swap in a different icon set.

## The contact form

The Contact page includes a message form, but this is a static site
with no server of its own — out of the box, submitting the form just
shows a local "thanks" message without actually sending anything.
`src/pages/Contact.jsx` has a detailed comment explaining how to wire it
up to a real service like [Formspree](https://formspree.io) or Netlify
Forms (if you deploy on Netlify).

## Deployment

This is a standard Vite + React app, so it deploys the same way as any
static site: run `npm run build`, which outputs a self-contained static
site into `dist/`, then host that folder.

**Netlify / Vercel / Cloudflare Pages (recommended, easiest):**
Connect this Git repository through the host's dashboard and set:
- Build command: `npm run build`
- Output/publish directory: `dist`

These hosts also automatically handle "client-side routing" correctly
(so refreshing `/shows` doesn't 404) and can wire up the contact form
(Netlify Forms) with minimal setup.

**GitHub Pages:** GitHub Pages serves project sites from a sub-path
(`https://username.github.io/repo-name/`), so you'll need to set
`base: '/repo-name/'` in `vite.config.js` (there's a commented-out line
already there — just uncomment and fill it in) before building, and add
a client-side-routing workaround (search "Vite React GitHub Pages SPA
routing" for current instructions, since this varies with GitHub Pages
config changes over time).

## Tech stack

- [React](https://react.dev/) 19 — UI library
- [Vite](https://vite.dev/) — dev server & build tool
- [React Router](https://reactrouter.com/) — client-side page routing
- [react-icons](https://react-icons.github.io/react-icons/) — brand icons
  for the social links
- Plain CSS (no framework) using CSS custom properties for theming —
  kept intentionally simple/dependency-light since this project is also
  meant as a learning exercise for React
