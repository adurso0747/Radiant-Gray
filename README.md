# Radiant Gray

[![CI](https://github.com/adurso0747/Radiant-Gray/actions/workflows/ci.yml/badge.svg)](https://github.com/adurso0747/Radiant-Gray/actions/workflows/ci.yml)

Website for Radiant Gray, a Philadelphia emo/shoegaze band:
**[radiantgrayband.com](https://radiantgrayband.com)**

![Radiant Gray home page](docs/screenshot.png)

A static, mobile-friendly band site (Home, Bio, Shows, Music, Merch, Contact)
that the band can update without touching code.

## Features

- Shows page that sorts itself into Upcoming and Past by date
- Music page with per-release streaming/Bandcamp links
- Home page with next-show and latest-release cards, an embedded latest
  video, and social links
- Contact form, backed by a small FastAPI service in its own repo
  ([Radiant-Gray-Api](https://github.com/adurso0747/Radiant-Gray-Api))
  rather than a third-party form handler
- Content-managed: shows, releases, members, photos and site text are edited
  through a CMS rather than in code
- Responsive layout, custom dark theme built on CSS variables
- Typed throughout (TypeScript, strict mode), with a Vitest + React Testing
  Library suite and a CI workflow that runs it on every push

## Stack

**Frontend:** React 19, TypeScript, Vite, React Router, plain CSS, Decap CMS,
Netlify. Vitest + React Testing Library for tests, GitHub Actions for CI.

**Contact API** (separate repo:
[Radiant-Gray-Api](https://github.com/adurso0747/Radiant-Gray-Api)):
FastAPI, SQLAlchemy + Alembic, Postgres (Neon), Resend, hosted on Render.

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build         # production build into dist/
npm run preview       # serve the production build locally
npm run lint          # oxlint
npm run typecheck     # tsc -b, no emit
npm run test          # vitest, single run
npm run test:watch    # vitest, watch mode
npm run test:coverage # vitest with a coverage report
```

## Structure

```
public/           static assets (images, CMS config, host config files)
src/
  components/     Navbar, Footer, SocialLinks, icons
  pages/          Home, Bio, Shows, Music, Merch, Contact, NotFound
  content/        site content as JSON
  data/           thin, typed layer over content/ that pages import from
  types/          content shape definitions (Show, Release, Member, ...)
  hooks/          usePageTitle
  utils/          date, slug, maps/calendar link and YouTube URL helpers
  styles/         global.css (design tokens and base styles)
  test/           Vitest setup (jest-dom matchers, cleanup)
```

The Contact API isn't in this repo — see
[Radiant-Gray-Api](https://github.com/adurso0747/Radiant-Gray-Api).

Tests live next to what they test (`Shows.tsx` / `Shows.test.tsx`, etc.)
rather than in a separate directory.

## Content

All site content lives in `src/content/*.json` (`site`, `shows`, `releases`,
`members`, `merch`). Pages read it through the modules in `src/data/`, typed
against the shapes in `src/types/content.ts`.

Theme colors, fonts and spacing are CSS variables at the top of
`src/styles/global.css`.

## Deployment

The frontend is built with `npm run build` and published from `dist/` on
Netlify, with `VITE_CONTACT_API_URL` (see `.env.example`) set in Netlify's
build environment variables to the deployed Contact API's URL.
`.github/workflows/ci.yml` runs typecheck/lint/test/build on every push and
PR — Netlify's own build is separate and unaffected by it either way.

The Contact API deploys separately from its own repo and is live at
[radiant-gray-api.onrender.com](https://radiant-gray-api.onrender.com) — see
[Radiant-Gray-Api](https://github.com/adurso0747/Radiant-Gray-Api)'s
README → "Deploying".
