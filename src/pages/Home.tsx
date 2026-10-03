import { Link } from 'react-router-dom';
import { band, home } from '../data/band';
import { shows } from '../data/shows';
import { releases } from '../data/releases';
import { formatShowDate, isUpcoming } from '../utils/formatDate';
import { getYouTubeVideoId } from '../utils/youtube';
import { getMapsUrl } from '../utils/maps';
import { getCalendarUrl } from '../utils/calendar';
import PinMark from '../components/icons/PinMark';
import CalendarMark from '../components/icons/CalendarMark';
import SocialLinks from '../components/SocialLinks';
import { usePageTitle } from '../hooks/usePageTitle';
import './Home.css';

/**
 * Home
 * ----
 * Landing page: hero banner, two teaser cards (next show, latest
 * release), then a "latest video + follow us" section. Social links
 * also live in the Footer (rendered on every page from App.tsx) — this
 * page's copy is a more prominent, higher-visibility placement, not a
 * replacement for that one.
 *
 * Each teaser card's button goes straight to that specific show/release
 * (the ticket link, the streaming link) rather than to the Shows/Music
 * pages — the hero buttons above already cover "see everything", so
 * these stay useful instead of just repeating that.
 *
 * The hero photo/tagline and the teasers all pull from `src/data/band.ts`,
 * `src/data/shows.ts`, and `src/data/releases.ts` — edit those (or their
 * underlying content in `src/content/`, or use the admin panel) and this
 * page updates automatically. (There's no merch teaser since the Merch
 * page is currently a "coming soon" placeholder — see src/pages/Merch.tsx.)
 */
function Home() {
  usePageTitle('Home');

  // `home.latestVideoUrl` is just whatever URL you'd copy from a
  // YouTube video's address bar — this pulls the actual video ID out of
  // it for the embed below. Returns `null` (and the video section just
  // doesn't render) if the field is empty or isn't a recognizable
  // YouTube URL.
  const latestVideoId = getYouTubeVideoId(home.latestVideoUrl);

  // Find the soonest show that hasn't happened yet. `[...shows]` copies
  // the array before `.sort()`, since `.sort()` mutates in place and we
  // don't want to reorder the original imported data.
  const nextShow = [...shows]
    .filter((show) => isUpcoming(show.date))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  // Newest release is assumed to be first in the array (see the comment
  // at the top of releases.ts).
  const latestRelease = releases[0];

  // Same rule as the Shows page (see Shows.tsx): an address only takes
  // over as the primary action (a "Directions" button) when there's no
  // ticket/info link and the show isn't sold out — otherwise it shows
  // as a small inline link next to the venue instead.
  const addressIsPrimaryAction =
    !!nextShow && !nextShow.soldOut && !nextShow.ticketUrl && !nextShow.infoUrl && !!nextShow.address;

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
                  {nextShow.address && !addressIsPrimaryAction && (
                    <a
                      href={getMapsUrl(nextShow.address)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="teaser-card__directions"
                    >
                      <PinMark size={12} />
                      Directions
                    </a>
                  )}
                </h3>
                <p className="teaser-card__meta">{formatShowDate(nextShow.date)}</p>
                {/* Shown whenever a time is set, independent of
                    ticket/info/address state — same rule as the Shows
                    page (see Shows.tsx). Links out to a Google Calendar
                    "add event" prefilled from the show. */}
                {nextShow.time && (
                  <a
                    href={getCalendarUrl(nextShow)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="teaser-card__time"
                  >
                    <CalendarMark size={12} />
                    {nextShow.time}
                  </a>
                )}
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
              ) : addressIsPrimaryAction ? (
                <a
                  href={getMapsUrl(nextShow!.address!)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn--outline"
                >
                  Directions
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

      {/* ---- Latest video + follow -------------------------------------
          The video only renders once `home.latestVideoUrl` is set to a
          real YouTube link (see the admin panel's Site Settings, or
          src/content/site.json) — until then this section is just the
          "follow along" half, so socials still get this prominent
          placement even before a video's been added. */}
      <section className="section home-follow">
        {/* The `has-video` modifier switches this from a single centered
            column (video-less fallback) to a two-column layout — video
            on one side, a vertical list of social links on the other,
            sized to fill the same height instead of just sitting below
            it. See Home.css. */}
        <div className={`container home-follow__inner ${latestVideoId ? 'has-video' : ''}`.trim()}>
          {latestVideoId && (
            <div className="home-follow__video">
              <span className="eyebrow">Latest Video</span>
              <div className="home-follow__video-frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${latestVideoId}`}
                  title={home.latestVideoTitle || `${band.name} — latest video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}

          <div className="home-follow__socials">
            <span className="eyebrow">Follow Along</span>
            <SocialLinks showLabels className={latestVideoId ? 'social-links--vertical' : ''} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
