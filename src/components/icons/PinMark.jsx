/**
 * PinMark
 * -------
 * A small map-pin glyph, used next to the band's location on the Home
 * page hero. Plain inline SVG (see MoonMark.jsx for the same pattern) —
 * uses `currentColor`, so it inherits whatever CSS `color` is set on it
 * or an ancestor.
 */
function PinMark({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
      />
    </svg>
  );
}

export default PinMark;
