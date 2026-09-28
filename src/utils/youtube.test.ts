import { describe, it, expect } from 'vitest';
import { getYouTubeVideoId } from './youtube';

describe('getYouTubeVideoId', () => {
  it('extracts the id from a standard watch URL', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts the id from a shortened youtu.be URL', () => {
    expect(getYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts the id from an embed URL', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts the id from a Shorts URL', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('ignores extra query params like share timestamps or playlist context', () => {
    expect(
      getYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s&list=PL123'),
    ).toBe('dQw4w9WgXcQ');
  });

  it('returns null for null input (no video configured)', () => {
    expect(getYouTubeVideoId(null)).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(getYouTubeVideoId('')).toBeNull();
  });

  it('returns null for a non-YouTube URL', () => {
    expect(getYouTubeVideoId('https://vimeo.com/12345')).toBeNull();
  });

  it('returns null for a string that is not a valid URL at all', () => {
    expect(getYouTubeVideoId('not a url')).toBeNull();
  });
});
