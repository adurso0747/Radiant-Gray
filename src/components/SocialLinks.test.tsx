import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SocialLinks from './SocialLinks';

// SocialLinks reads URLs from src/data/band.ts, which in turn reads real
// site content — mocking it here means these tests describe SocialLinks'
// own behavior (skip missing platforms, icon-only vs labeled) rather than
// depending on whatever's currently in src/content/site.json.
vi.mock('../data/band', () => ({
  socialLinks: {
    instagram: 'https://instagram.com/testband',
    tiktok: 'https://tiktok.com/@testband',
    youtube: null, // deliberately unset, to prove it's hidden below
    spotify: 'https://open.spotify.com/artist/test',
  },
}));

describe('SocialLinks', () => {
  it('renders a link for every platform with a URL set', () => {
    render(<SocialLinks />);
    expect(screen.getByTitle('Instagram')).toHaveAttribute('href', 'https://instagram.com/testband');
    expect(screen.getByTitle('TikTok')).toHaveAttribute('href', 'https://tiktok.com/@testband');
    expect(screen.getByTitle('Spotify')).toHaveAttribute(
      'href',
      'https://open.spotify.com/artist/test',
    );
  });

  it('skips a platform whose URL is null', () => {
    render(<SocialLinks />);
    expect(screen.queryByTitle('YouTube')).not.toBeInTheDocument();
  });

  it('opens links safely in a new tab', () => {
    render(<SocialLinks />);
    const link = screen.getByTitle('Instagram');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('default (icon-only) badges carry an aria-label but no visible platform name', () => {
    render(<SocialLinks />);
    const link = screen.getByTitle('Instagram');
    expect(link).toHaveAttribute('aria-label', expect.stringContaining('Instagram'));
    expect(link).not.toHaveTextContent('Instagram');
  });

  it('showLabels renders the platform name as visible text instead', () => {
    render(<SocialLinks showLabels />);
    const link = screen.getByTitle('Instagram');
    expect(link).toHaveTextContent('Instagram');
    // The visible text already gives the link its accessible name, so
    // the icon-only mode's aria-label would just be a redundant
    // duplicate here — see the comment in SocialLinks.tsx.
    expect(link).not.toHaveAttribute('aria-label');
  });
});
