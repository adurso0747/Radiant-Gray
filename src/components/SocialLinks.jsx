import { SiInstagram, SiTiktok, SiYoutube, SiSpotify } from 'react-icons/si';
import { socialLinks } from '../data/band';
import './SocialLinks.css';

/**
 * SocialLinks
 * -----------
 * Renders a row of icon links out to Instagram / TikTok / YouTube /
 * Spotify, reading URLs from `src/data/band.js`. Update the URLs there —
 * this component doesn't need to change.
 *
 * If a platform's URL is set to `null` in band.js, its link is skipped
 * entirely (so you can hide a platform you don't use yet without editing
 * this file).
 *
 * Icons come from the `react-icons` package (specifically its "Simple
 * Icons" set, `react-icons/si`), which ships each brand's actual
 * logomark as an SVG component — that's what makes it instantly obvious
 * which platform a link goes to. Each icon renders in a single color
 * (`currentColor`, i.e. whatever CSS `color` is set — see
 * SocialLinks.css) rather than the brand's official multicolor style, to
 * stay consistent with the rest of the site's monochrome look.
 */
function SocialLinks({ className = '' }) {
  // Each entry: the key in `socialLinks`, the icon component to render,
  // and the full platform name (used for screen readers + the tooltip).
  const platforms = [
    { key: 'instagram', Icon: SiInstagram, name: 'Instagram' },
    { key: 'tiktok', Icon: SiTiktok, name: 'TikTok' },
    { key: 'youtube', Icon: SiYoutube, name: 'YouTube' },
    { key: 'spotify', Icon: SiSpotify, name: 'Spotify' },
  ];

  return (
    <ul className={`social-links ${className}`.trim()}>
      {platforms.map(({ key, Icon, name }) => {
        const url = socialLinks[key];
        if (!url) return null; // skip platforms with no URL set

        return (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              title={name}
              aria-label={`Radiant Gray on ${name} (opens in a new tab)`}
              className="social-links__badge"
            >
              <Icon aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default SocialLinks;
