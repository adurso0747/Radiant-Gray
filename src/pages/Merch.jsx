import { usePageTitle } from '../hooks/usePageTitle';
import './Merch.css';

/**
 * Merch
 * -----
 * Placeholder "coming soon" page — there's no merch to sell yet.
 *
 * `src/data/merch.js` already has the data shape ready (name, price,
 * category, photo, buy link, sold-out flag) for whenever there's real
 * merch to list. To turn this into an actual catalog page once that's
 * true, swap the message below for a grid that maps over `merchItems`
 * — see the Music page (`src/pages/Music.jsx`) for the exact pattern
 * (it maps over `releases` from `src/data/releases.js` the same way).
 */
function Merch() {
  usePageTitle('Merch');

  return (
    <div className="container section merch-page">
      <span className="eyebrow">Store</span>
      <h1>Merch</h1>

      <div className="merch-page__coming-soon">
        <p>Merch is on the way, check back soon!</p>
      </div>
    </div>
  );
}

export default Merch;
