import { releases } from '../data/releases';
import { usePageTitle } from '../hooks/usePageTitle';
import './Music.css';

/**
 * Music
 * -----
 * Grid of releases from `src/data/releases.ts`, each with cover art
 * (each release's `coverImage` field) and links out to
 * streaming/Bandcamp — only the links that are actually set show up
 * (see `release-card__links` below), so a Bandcamp-only release doesn't
 * get a dead "Listen" button.
 *
 * Once you have a real Spotify link, you can also embed a real player
 * instead of (or alongside) the buttons — see the commented-out
 * example near the bottom of this file.
 */
function Music() {
  usePageTitle('Music');

  return (
    <div className="container section music-page">
      <span className="eyebrow">Discography</span>
      <h1>Music</h1>

      <ul className="music-page__grid">
        {releases.map((release) => (
          <li key={release.id} className="release-card">
            <img className="release-card__cover" src={release.coverImage} alt={release.coverAlt} />

            <div className="release-card__info">
              <h3>{release.title}</h3>
              <p className="release-card__meta">
                {release.type} · {release.year}
              </p>

              <div className="release-card__links">
                {release.streamingUrl && (
                  <a
                    href={release.streamingUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn--small"
                  >
                    Listen
                  </a>
                )}
                {release.bandcampUrl && (
                  <a
                    href={release.bandcampUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    // Bandcamp is the secondary (outline) button when
                    // Listen is also shown, but becomes the primary
                    // (solid) button when it's the only option.
                    className={`btn btn--small ${release.streamingUrl ? 'btn--outline' : ''}`.trim()}
                  >
                    Bandcamp
                  </a>
                )}
                {!release.streamingUrl && !release.bandcampUrl && (
                  <span className="release-card__tba">Coming Soon</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/*
        EMBEDDING A REAL SPOTIFY PLAYER
        --------------------------------
        Once a release is live on Spotify, you can grab its embed code
        (Spotify → "..." menu → Share → Embed track/album) and drop an
        iframe like this wherever you'd like a real player to show up,
        e.g. right under a release's info above:

        <iframe
          style={{ borderRadius: '8px' }}
          src="https://open.spotify.com/embed/album/YOUR_ALBUM_ID"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`${release.title} on Spotify`}
        />

        Note the two React-specific spellings vs. plain HTML:
        `frameBorder` (not `frame-border`) and `style={{ ... }}` (a JS
        object, not a CSS string).
      */}
    </div>
  );
}

export default Music;
