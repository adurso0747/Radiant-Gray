import { SiInstagram, SiTiktok, SiYoutube, SiSpotify } from 'react-icons/si';
import type { IconType } from 'react-icons';
import { socialLinks } from '../data/band';
import type { SocialLinks as SocialLinksData } from '../types/content';
import './SocialLinks.css';

interface SocialLinksProps {
  className?: string;
  showLabels?: boolean;
}

interface Platform {
  key: keyof SocialLinksData;
  Icon: IconType;
  name: string;
}

/**
 * SocialLinks
 * -----------
 * Renders links out to Instagram / TikTok / YouTube / Spotify, reading
 * URLs from `src/data/band.ts`. Update the URLs there — this component
 * doesn't need to change.
 *
 * If a platform's URL is set to `null` in band.ts, its link is skipped
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
 *
 * Two looks, via the `showLabels` prop:
 *   - `showLabels={false}` (default) — small square icon-only badges.
 *     Used in the Footer (every page) and the Contact page, where
 *     they're a secondary, compact detail.
 *   - `showLabels={true}` — wider pill buttons with the platform's name
 *     spelled out next to its icon. Used on the Home page's "Follow
 *     Along" section, so it reads as its own deliberate thing rather
 *     than just a repeat of the footer.
 */
function SocialLinks({ className = '', showLabels = false }: SocialLinksProps) {
  // Each entry: the key in `socialLinks`, the icon component to render,
  // and the full platform name (used as the label, and always for
  // screen readers + the tooltip even when the label isn't shown).
  const platforms: Platform[] = [
    { key: 'instagram', Icon: SiInstagram, name: 'Instagram' },
    { key: 'tiktok', Icon: SiTiktok, name: 'TikTok' },
    { key: 'youtube', Icon: SiYoutube, name: 'YouTube' },
    { key: 'spotify', Icon: SiSpotify, name: 'Spotify' },
  ];

  const listClassName = `social-links ${showLabels ? 'social-links--labeled' : ''} ${className}`.trim();

  return (
    <ul className={listClassName}>
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
              // When the name is shown as visible text (below), that
              // text already becomes the link's accessible name, so an
              // aria-label would just be a redundant duplicate — only
              // needed for the icon-only badge, which has no text.
              aria-label={showLabels ? undefined : `Radiant Gray on ${name} (opens in a new tab)`}
              className={showLabels ? 'social-links__pill' : 'social-links__badge'}
            >
              <Icon aria-hidden="true" />
              {showLabels && <span>{name}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default SocialLinks;
