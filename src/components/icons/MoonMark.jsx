/**
 * MoonMark
 * --------
 * A small crescent-moon glyph used as a recurring brand accent (next to
 * the wordmark in the Navbar, and above the headline on Home) — a nod to
 * the band's cover art without embedding that actual photo.
 *
 * It's a plain inline SVG (no icon library needed for one shape) and
 * uses `currentColor`, so it inherits whatever CSS `color` is set on it
 * or an ancestor — see `.navbar__brand-icon` in Navbar.css for an
 * example of tinting it via CSS instead of a prop.
 */
function MoonMark({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      {/* A crescent, drawn as a circle with a second, offset circle cut
          out of it via evenodd fill. */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a10 10 0 1 0 9.8 12.02 8 8 0 0 1-9.79-11.8c.03-.2-.01-.22-.01-.22Z"
      />
    </svg>
  );
}

export default MoonMark;
