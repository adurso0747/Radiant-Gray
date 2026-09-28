import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatShowDate, isUpcoming } from './formatDate';

describe('formatShowDate', () => {
  it('formats an ISO date as "MON D, YYYY" in uppercase', () => {
    expect(formatShowDate('2026-10-03')).toBe('OCT 3, 2026');
  });

  it('does not shift to the previous day for timezones west of UTC', () => {
    // The classic gotcha this function works around: parsing
    // '2026-01-01' *without* a local time component would be read as
    // UTC midnight, which displays as Dec 31 in US timezones. Jan 1
    // staying Jan 1 confirms the 'T00:00:00' local-time fix is in place.
    expect(formatShowDate('2026-01-01')).toBe('JAN 1, 2026');
  });
});

describe('isUpcoming', () => {
  // Freezes "today" so this doesn't quietly start failing in the future
  // — without this, a date that's "upcoming" when the test was written
  // eventually becomes "past" as real time moves on.
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is true for a future date', () => {
    expect(isUpcoming('2026-06-16')).toBe(true);
  });

  it('is true for today itself', () => {
    expect(isUpcoming('2026-06-15')).toBe(true);
  });

  it('is false for a past date', () => {
    expect(isUpcoming('2026-06-14')).toBe(false);
  });
});
