import { useEffect } from 'react';

/**
 * usePageTitle
 * ------------
 * A tiny custom hook that sets the browser tab title (`document.title`)
 * for whichever page calls it, e.g.:
 *
 *   usePageTitle('Shows');
 *   // -> tab title becomes "Shows | Radiant Gray"
 *
 * This is a plain "custom hook" — just a regular function whose name
 * starts with `use` and that calls other hooks (here, `useEffect`)
 * inside it. React doesn't do anything special to register it; the
 * `use` prefix is just a convention that tells React (and other
 * developers) it follows the rules of hooks.
 *
 * `useEffect` runs *after* React updates the page, and re-runs whenever
 * a value in its dependency array (the `[title]` below) changes — so
 * switching pages (which changes `title`) updates the tab title again.
 */
export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = title ? `${title} | Radiant Gray` : 'Radiant Gray';
  }, [title]);
}
