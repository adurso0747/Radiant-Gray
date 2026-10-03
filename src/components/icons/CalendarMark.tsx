interface CalendarMarkProps {
  size?: number;
  className?: string;
}

/**
 * CalendarMark
 * ------------
 * A small calendar glyph, used next to show times that link out to
 * "add to calendar". Plain inline SVG (see PinMark.tsx for the same
 * pattern) — uses `currentColor`, so it inherits whatever CSS `color`
 * is set on it or an ancestor.
 */
function CalendarMark({ size = 16, className = '' }: CalendarMarkProps) {
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
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}

export default CalendarMark;
