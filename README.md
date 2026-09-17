# Radiant Gray

The official website for Radiant Gray — built with [React](https://react.dev/)
and [Vite](https://vite.dev/). This README covers how to run the site
locally, how the project is organized, how to edit content (by hand, or
through the built-in admin panel), and how to deploy it.

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
npm run cms       # runs a local proxy so you can test the admin panel
                  # (see "Managing content with the admin panel" below)
```

## Project structure

```
public/
  favicon.svg       — browser tab icon (a simple placeholder monogram)
  images/           — real photos live here; see public/images/README.md
  admin/            — the content admin panel (Decap CMS), served at /admin
    index.html
    config.yml      — defines what the admin panel can edit, and how
  _redirects        — makes client-side routing (React Router) work on
                      Netlify/Cloudflare Pages — see "Deployment" below
index.html          — the single HTML page; loads fonts and src/main.jsx
vite.config.js      — build config; also makes /admin work in local dev
src/
  main.jsx          — entry point, mounts <App /> into index.html
  App.jsx           — sets up page routing + shared layout (Navbar/Footer)
  styles/
    global.css      — design tokens (colors/fonts/spacing) + base styles
  components/       — small reusable pieces used across pages
    Navbar.jsx / .css
    Footer.jsx / .css
    SocialLinks.jsx / .css   — icon links, see "Social icons" below
    icons/
      MoonMark.jsx    — small decorative crescent-moon brand glyph
      PinMark.jsx     — small map-pin glyph (Home page location line)
  pages/            — one file per site page, each with a matching .css
    Home.jsx / .css
    Bio.jsx / .css
    Shows.jsx / .css
    Music.jsx / .css
    Merch.jsx / .css
    Contact.jsx / .css
    NotFound.jsx / .css   — shown for any unknown URL
  content/          — the actual content, as JSON — this is what the
                      admin panel edits directly
    site.json          — band info, social links, Home/Bio page photos & text
    shows.json          — show/tour dates
    releases.json      — albums/EPs/singles
    merch.json          — merch catalog
    members.json        — band member roster
  data/             — a thin, documented layer over src/content/*.json;
                      pages import from here (e.g. `src/data/shows.js`),
                      never straight from src/content/ — see "Editing
                      content" below
    band.js
    shows.js
    releases.js
    merch.js
    members.js
  hooks/
    usePageTitle.js  — small custom hook that sets the browser tab title
  utils/
    formatDate.js    — shared date-formatting helpers
    slugify.js        — turns text into a URL-safe id, used to
                        auto-generate each content item's React `key`
```

Every `.jsx` file has comments at the top explaining what it does — the
`src/data/` files are the best starting point for understanding what
content exists, since editing what they read from changes the site
without touching any component code.

## Editing content

There are two ways to update the site's content — pick whichever's more
convenient at the time; they edit the exact same files underneath, so
you can freely mix and match.

**Option A: the admin panel.** Go to `/admin` on the deployed site (e.g.
`https://your-site.com/admin`), log in, and edit shows/music/merch/band
members/photos through a form UI. No code, no text editor, works from
your phone. This is the easiest way to post a new show the night before
it's announced, or swap in a new band photo. See **"Managing content
with the admin panel"** below for the (one-time) setup this needs and
how to use it day to day.

**Option B: edit the files directly.** Everything the admin panel edits
is plain JSON in `src/content/`:

- **Band info, social links, Home/Bio photos & text** → `src/content/site.json`
- **Shows** → `src/content/shows.json` (the Shows page automatically
  sorts these into Upcoming/Past based on today's date — you don't need
  to keep the list in order yourself)
- **Music releases** → `src/content/releases.json` (put your newest
  release first — the Music page renders them in list order)
- **Merch** → `src/content/merch.json` (not wired up yet — the Merch
  page is currently a "coming soon" placeholder since there's nothing
  to sell. See the comment at the top of `src/pages/Merch.jsx` for how
  to turn it into a real catalog page once you have merch.)
- **Band members** → `src/content/members.json`

Each `src/data/*.js` file (which is what the actual page code imports)
has a comment at the top describing every field available in its
matching `src/content/*.json` file — read those for the full field
list. Images referenced from JSON (`"heroImage": "/images/hero.jpg"`,
etc.) point at files in `public/images/` — see
[`public/images/README.md`](public/images/README.md) for how that
folder works if you're adding an image by hand instead of through the
admin panel.

To change the actual page layout/copy that *isn't* content (e.g. the
button labels on the Home page, or the overall page structure), edit
the corresponding file in `src/pages/`.

## Managing content with the admin panel

This site includes [Decap CMS](https://decapcms.org/) (formerly Netlify
CMS) — a free, open-source admin panel that lives at `/admin`. It
doesn't need a database or a server of its own: when you save something,
it commits the change directly to this GitHub repo (the same
`src/content/*.json` files, plus uploaded images into `public/images/`),
which automatically triggers a rebuild and redeploy of the live site.

### One-time setup (requires deploying on Netlify)

Decap CMS needs somewhere to handle login. The simplest option — no
extra accounts, no server to run — is Netlify's **Identity** +
**Git Gateway** features, which only work if this site is hosted on
Netlify (see "Deployment" below for connecting the repo to Netlify in
the first place):

1. In your Netlify site's dashboard: **Site configuration → Identity →
   Enable Identity**.
2. Under Identity's **Registration** setting, choose **Invite only**
   (so random people can't sign themselves up to edit your site).
3. Under **Services → Git Gateway**, click **Enable Git Gateway**. This
   is what lets Identity users commit to the repo without needing their
   own GitHub account/token.
4. Back in **Identity**, click **Invite users** and invite yourself
   (and anyone else in the band who should be able to post updates).
   You'll get an email with a link to set a password.
5. Go to `https://your-site.netlify.app/admin`, click **Login with
   Netlify Identity**, and sign in.

That's it — from then on, `/admin` is your content editor.

(If you deploy somewhere other than Netlify instead — Vercel, GitHub
Pages, etc — Decap CMS still works, but auth takes a bit more setup: a
GitHub OAuth app plus a small proxy service. Netlify's own docs cover
this under "External OAuth clients" if you go that route.)

### Using it day to day

- Log in at `/admin`, pick a collection (Shows, Music, Merch, Band
  Members, or Site Settings) in the left sidebar, and edit or add an
  entry.
- Image fields let you upload straight from your computer/phone — no
  need to touch `public/images/` yourself.
- Hit **Publish** (or **Save**, depending on the field) when you're
  done. That commits the change to the repo.

**Two things worth knowing:**

- **It's not instant.** Publishing triggers a real rebuild of the site,
  which typically takes somewhere between 30 seconds and 2 minutes
  before the change is actually live — refreshing the site immediately
  after saving won't show it yet.
- **It won't compress your photos for you.** Unlike the images already
  in this project (which were manually resized/compressed before
  adding), whatever you upload through the admin panel goes in as-is.
  A modern phone photo can easily be 10-20MB — resize it down first
  (aim for under ~2000px on the longest side) so the site stays fast to
  load. Free tools like [Squoosh](https://squoosh.app/) do this
  entirely in your browser.

### Testing the admin panel locally

You can try out (or make real edits through) the admin panel on your
own machine, without deploying first or needing Netlify Identity login.
Run these in two separate terminals:

```bash
npm run dev   # the site itself, usually http://localhost:5173
npm run cms   # a local proxy that lets the admin panel write
              # straight to your local files instead of GitHub
```

Then visit `http://localhost:5173/admin/`. The CMS detects it's running
locally and swaps in a plain "Login" button instead of Netlify
Identity — click it, and you're straight into the editor. Anything you
publish here writes directly to the matching file in `src/content/` on
disk, exactly like editing it by hand — nothing is pushed to GitHub
until you commit it yourself.

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

The Contact page's message form is wired up to **Netlify Forms** —
submitting it really does send the band an email, no backend code of
our own required. This only works once the site is actually deployed
on Netlify (see "Deployment" below); running it locally, or hosting it
somewhere else, the form will show an error message with the mailto
link as a fallback instead.

React + Netlify Forms needs one extra piece most tutorials skip:
Netlify only detects forms by scanning the plain HTML it deploys, but
this form only exists once React renders it in the browser — so
`index.html` also has a hidden, plain-HTML copy of the same form purely
so Netlify's build can find it. See the comment at the top of
`src/pages/Contact.jsx` for the full explanation, and update that
hidden copy too if you ever add/remove a field.

Submissions show up in the Netlify dashboard under **Forms**, and you
can turn on email notifications there (Site configuration →
Notifications → Form submission notifications) so you actually see them
without checking the dashboard.

## Deployment

This is a standard Vite + React app, so it deploys the same way as any
static site: run `npm run build`, which outputs a self-contained static
site into `dist/`, then host that folder.

**Netlify (recommended — also what the admin panel needs):**
Connect this Git repository through the Netlify dashboard and set:
- Build command: `npm run build`
- Publish directory: `dist`

`public/_redirects` (copied into every build) is what makes
"client-side routing" work on Netlify — without it, refreshing on
`/shows` or linking straight to `/contact` would 404, since those pages
only exist as far as React Router is concerned, not as real files.
Netlify is also what the contact form (Netlify Forms) and the admin
panel's login (Identity + Git Gateway) are both built around — see "The
contact form" and "Managing content with the admin panel" above.

**Cloudflare Pages:** Same build command/output directory as above, and
also honors `public/_redirects` (same file format as Netlify), so
client-side routing works the same way. The admin panel would need a
different setup, though — it's built around Netlify Identity/Git
Gateway specifically.

**Vercel:** Same build command/output directory, but needs its own
config instead of `_redirects` — a `vercel.json` with a rewrite rule
sending everything to `/index.html` (see Vercel's docs on SPA
rewrites). The contact form and admin panel would both need different
approaches too (Vercel doesn't have Netlify Forms or Identity/Git
Gateway equivalents built in).

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
- [Decap CMS](https://decapcms.org/) — the `/admin` content editor (a
  static page loaded from a CDN, not an npm dependency of the app
  itself — see `public/admin/`); `decap-server` is a small dev-only
  devDependency used only for testing it locally (`npm run cms`), never
  shipped to the built site
- Plain CSS (no framework) using CSS custom properties for theming —
  kept intentionally simple/dependency-light since this project is also
  meant as a learning exercise for React
