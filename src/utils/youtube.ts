/**
 * youtube.ts
 * ----------
 * Pulls a video ID out of a normal YouTube URL, so the Home page's
 * "Latest Video" field (see `home.latestVideoUrl` in
 * `src/content/site.json`) can just be whatever link you'd copy from
 * your browser's address bar — no need to know what a "video ID" is.
 *
 * Handles the URL shapes YouTube actually hands out:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 * plus any extra query params those come with (share timestamps,
 * playlist context, etc) — those are just ignored.
 */
export function getYouTubeVideoId(url: string | null): string | null {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null; // not a valid URL at all
  }

  if (parsed.hostname === 'youtu.be') {
    return parsed.pathname.slice(1) || null;
  }

  if (parsed.hostname.includes('youtube.com')) {
    if (parsed.pathname === '/watch') {
      return parsed.searchParams.get('v');
    }
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.replace('/embed/', '') || null;
    }
    if (parsed.pathname.startsWith('/shorts/')) {
      return parsed.pathname.replace('/shorts/', '') || null;
    }
  }

  return null; // not a recognizable YouTube URL
}
