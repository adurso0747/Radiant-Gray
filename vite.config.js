import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

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
function serveAdminIndex() {
  return {
    name: 'serve-admin-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
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
})
