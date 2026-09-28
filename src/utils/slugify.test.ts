import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('My Fatal Flaw')).toBe('my-fatal-flaw');
  });

  it('collapses runs of punctuation into a single hyphen', () => {
    expect(slugify('Township Hall VFW -- Bloomington, IN')).toBe('township-hall-vfw-bloomington-in');
  });

  it('trims leading and trailing hyphens left over from stripped punctuation', () => {
    expect(slugify('!!!Weston!!!')).toBe('weston');
  });

  it('trims surrounding whitespace', () => {
    expect(slugify('  Radiant Gray  ')).toBe('radiant-gray');
  });

  it('leaves an already-safe slug unchanged', () => {
    expect(slugify('already-a-slug')).toBe('already-a-slug');
  });
});
