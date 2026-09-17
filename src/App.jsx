import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Bio from './pages/Bio';
import Shows from './pages/Shows';
import Music from './pages/Music';
import Merch from './pages/Merch';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

/**
 * App
 * ---
 * Top-level component: sets up client-side routing and the shared page
 * layout (Navbar + page content + Footer).
 *
 * `<BrowserRouter>` enables React Router's URL-based navigation.
 * `<Routes>` picks the one `<Route>` whose `path` matches the current
 * URL and renders its `element`. Adding a new page to the site means:
 *   1. Create `src/pages/YourPage.jsx`
 *   2. Import it above and add a `<Route path="/your-page" .../>` below
 *   3. Add a link to it in `src/components/Navbar.jsx`'s `navLinks` list
 *
 * Note on deployment: this is "client-side routing" — the server just
 * needs to serve `index.html` for any unknown path and React Router
 * takes it from there. Most static hosts (Netlify, Vercel, Cloudflare
 * Pages) do this automatically for Vite apps; see README.md if you hit
 * 404s on refresh after deploying elsewhere.
 */
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* `id="main-content"` is the target of the "Skip to content" link
          in Navbar.jsx. `<main>` is the semantic landmark screen readers
          use to jump straight to page content. */}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bio" element={<Bio />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/music" element={<Music />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/contact" element={<Contact />} />
          {/* Catch-all: anything that doesn't match a route above */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
