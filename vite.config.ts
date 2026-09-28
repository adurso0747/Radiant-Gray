import react from '@vitejs/plugin-react'
// `defineConfig` from 'vitest/config' (not plain 'vite') re-exports Vite's
// own defineConfig with the extra `test` option's types merged in — this
// is the one file both Vite and Vitest read, so this import is what lets
// the `test: {...}` block below type-check at all.
import { defineConfig, type Plugin } from 'vitest/config'

/**
 * serveAdminIndex
 * ---------------
 * Dev-server-only convenience: makes `/admin` and `/admin/` (no
 * trailing filename) load `public/admin/index.html` — the Decap CMS
 * admin panel — while running `npm run dev`.
 *
 * This is only needed locally: real static hosts (Netlify, Vercel,
 * Cloudflare Pages, GitHub Pages) already serve a folder's index.html
 * automatically for a bare `/admin/` URL once deployed, so this plugin
 * has no effect on (and isn't needed for) the deployed site — Vite's
 * own dev server is just the one that doesn't do that by default.
 */
function serveAdminIndex(): Plugin {
  return {
    name: 'serve-admin-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') {
          req.url = '/admin/index.html'
        }
        next()
      })
    },
  }
}

// See: https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveAdminIndex()],

  // If you deploy to a sub-path (e.g. GitHub Pages project site at
  // https://username.github.io/repo-name/), uncomment the line below and
  // set it to '/repo-name/'. Hosts like Netlify/Vercel/Cloudflare Pages
  // serve from the domain root, so you can leave this alone for those.
  // base: '/repo-name/',

  test: {
    // Tests render React components into a fake DOM — jsdom provides
    // that (document, window, etc.) in Node, where none of it normally
    // exists.
    environment: 'jsdom',
    // Runs once before each test file: registers jest-dom's matchers
    // (toBeInTheDocument(), etc.) and cleans up the rendered DOM between
    // tests so one test's markup can't leak into the next.
    setupFiles: ['./src/test/setup.ts'],
    // Deliberately NOT using Vitest's `globals: true` shortcut — every
    // test file explicitly imports `describe`/`it`/`expect` from
    // 'vitest' instead, so it's obvious where they come from rather
    // than relying on ambient globals.
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/content/**', 'src/types/**', 'src/vite-env.d.ts', 'src/main.tsx'],
    },
  },
})
