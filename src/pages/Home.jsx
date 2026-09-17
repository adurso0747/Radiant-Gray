import { Link } from 'react-router-dom';
import { band, home } from '../data/band';
import { shows } from '../data/shows';
import { releases } from '../data/releases';
import { formatShowDate, isUpcoming } from '../utils/formatDate';
import PinMark from '../components/icons/PinMark';
import { usePageTitle } from '../hooks/usePageTitle';
import './Home.css';

/**
 * Home
 * ----
 * Landing page: hero banner, then two teaser cards (next show, latest
 * release) giving a quick overview of the rest of the site. Social
 * links live in the Footer (rendered on every page from App.jsx), so
 * they're not repeated here.
 *
 * Each card's button goes straight to that specific show/release (the
 * ticket link, the streaming link) rather than to the Shows/Music pages
 * — the hero buttons above already cover "see everything", so these
 * stay useful instead of just repeating that.
 *
 * The hero photo/tagline and the teasers all pull from `src/data/band.js`,
 * `src/data/shows.js`, and `src/data/releases.js` — edit those (or their
 * underlying content in `src/content/`, or use the admin panel) and this
 * page updates automatically. (There's no merch teaser since the Merch
 * page is currently a "coming soon" placeholder — see src/pages/Merch.jsx.)
 */
function Home() {
  usePageTitle('Home');

  // Find the soonest show that hasn't happened yet. `[...shows]` copies
  // the array before `.sort()`, since `.sort()` mutates in place and we
  // don't want to reorder the original imported data.
  const nextShow = [...shows]
    .filter((show) => isUpcoming(show.date))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  // Newest release is assumed to be first in the array (see the comment
  // at the top of releases.js).
  const latestRelease = releases[0];

  return (
    <>
      {/* ---- Hero ---------------------------------------------------- */}
      <section className="hero section">
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="eyebrow hero__location">
              <PinMark size={14} />
              {band.location}
            </span>
            <h1>{band.name}</h1>
            <p className="hero__tagline">{band.tagline}</p>
            <div className="hero__actions">
              <Link to="/shows" className="btn">
                See Shows
              </Link>
              <Link to="/music" className="btn btn--outline">
                See Releases
              </Link>
            </div>
          </div>

          <img className="hero__image" src={home.heroImage} alt={home.heroImageAlt} />
        </div>
      </section>

      {/* ---- Teasers: next show + latest release ---------------------- */}
      <section className="section teasers">
        <div className="container teasers__grid">
          <div className="teaser-card">
            <span className="eyebrow">Next Show</span>
            {nextShow ? (
              <>
                <h3>
                  {nextShow.venue} - {nextShow.city}, {nextShow.state}
                </h3>
                <p className="teaser-card__meta">{formatShowDate(nextShow.date)}</p>
              </>
            ) : (
              <p className="teaser-card__meta">No shows booked yet — check back soon.</p>
            )}

            {/* `teaser-card__cta` always sits at the bottom of the card
                (see Home.css) so the two cards' buttons line up evenly
                even when the text above is a different length. */}
            <div className="teaser-card__cta">
              {nextShow?.soldOut ? (
                <span className="badge badge--sold-out">Sold Out</span>
              ) : nextShow?.ticketUrl ? (
                <a
                  href={nextShow.ticketUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn--outline"
                >
                  Get Tickets
                </a>
              ) : nextShow?.infoUrl ? (
                <a
                  href={nextShow.infoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn--outline"
                >
                  Event Info
                </a>
              ) : nextShow ? (
                <span className="teaser-card__tba">Event Info Coming Soon</span>
              ) : (
                <Link to="/shows" className="btn btn--outline">
                  See All Shows
                </Link>
              )}
            </div>
          </div>

          <div className="teaser-card">
            <span className="eyebrow">Latest Release</span>
            {latestRelease ? (
              <>
                <h3>{latestRelease.title}</h3>
                <p className="teaser-card__meta">
                  {latestRelease.type} · {latestRelease.year}
                </p>
              </>
            ) : (
              <p className="teaser-card__meta">Nothing released yet — stay tuned.</p>
            )}

            <div className="teaser-card__cta">
              {latestRelease?.streamingUrl ? (
                <a
                  href={latestRelease.streamingUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn--outline"
                >
                  Listen
                </a>
              ) : latestRelease?.bandcampUrl ? (
                // Bandcamp-only release (no streaming link yet) — see
                // the same fallback on the Music page.
                <a
                  href={latestRelease.bandcampUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn--outline"
                >
                  Bandcamp
                </a>
              ) : (
                <Link to="/music" className="btn btn--outline">
                  See All Music
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
