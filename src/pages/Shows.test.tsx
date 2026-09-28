import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Shows from './Shows';
import type { Show } from '../types/content';

// `vi.mock` calls are hoisted above regular imports and top-level code,
// so the fixture data has to be created *inside* `vi.hoisted` too — a
// plain `const` declared out here would still end up referenced before
// it exists at runtime once the mock factory is hoisted above it.
const { mockShows } = vi.hoisted(() => {
  const mockShows: Show[] = [
    {
      id: 'upcoming-with-tickets',
      date: '2026-07-01',
      venue: 'Ticketed Venue',
      city: 'Testville',
      state: 'TS',
      ticketUrl: 'https://example.com/tickets',
      infoUrl: null,
      soldOut: false,
      supportedBy: ['Support Act'],
    },
    {
      id: 'upcoming-with-info-only',
      date: '2026-07-02',
      venue: 'Info Only Venue',
      city: 'Testville',
      state: 'TS',
      ticketUrl: null,
      infoUrl: 'https://facebook.com/events/123',
      soldOut: false,
      supportedBy: [],
    },
    {
      id: 'upcoming-with-neither',
      date: '2026-07-03',
      venue: 'Mystery Venue',
      city: 'Testville',
      state: 'TS',
      ticketUrl: null,
      infoUrl: null,
      soldOut: false,
      supportedBy: [],
    },
    {
      id: 'upcoming-sold-out',
      date: '2026-07-04',
      venue: 'Sold Out Venue',
      city: 'Testville',
      state: 'TS',
      // soldOut takes priority even though a ticket link is still set —
      // this fixture pins that behavior down.
      ticketUrl: 'https://example.com/tickets',
      infoUrl: null,
      soldOut: true,
      supportedBy: [],
    },
    {
      id: 'a-past-show',
      date: '2026-01-01',
      venue: 'Old Venue',
      city: 'Testville',
      state: 'TS',
      ticketUrl: 'https://example.com/tickets',
      infoUrl: null,
      soldOut: false,
      supportedBy: [],
    },
  ];
  return { mockShows };
});

vi.mock('../data/shows', () => ({ shows: mockShows }));

describe('Shows', () => {
  // Freezes "today" between the fixtures' 2026-01-01 (past) and
  // 2026-07-0x (upcoming) dates, so the Upcoming/Past split is
  // deterministic regardless of when the test actually runs.
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('splits shows into Upcoming and Past sections by date', () => {
    render(<Shows />);
    expect(screen.getByRole('heading', { name: 'Upcoming' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Past' })).toBeInTheDocument();
    expect(screen.getByText(/Old Venue/)).toBeInTheDocument();
  });

  it('shows a Tickets button when ticketUrl is set', () => {
    render(<Shows />);
    expect(screen.getByRole('link', { name: 'Tickets' })).toHaveAttribute(
      'href',
      'https://example.com/tickets',
    );
  });

  it('shows an Event Info button when only infoUrl is set', () => {
    render(<Shows />);
    expect(screen.getByRole('link', { name: 'Event Info' })).toHaveAttribute(
      'href',
      'https://facebook.com/events/123',
    );
  });

  it('shows "Event Info Coming Soon" when neither link is set', () => {
    render(<Shows />);
    expect(screen.getByText('Event Info Coming Soon')).toBeInTheDocument();
  });

  it('shows a Sold Out badge instead of a Tickets link when soldOut is true', () => {
    render(<Shows />);
    expect(screen.getByText('Sold Out')).toBeInTheDocument();
    // Only the one non-sold-out show's Tickets link should exist — the
    // sold-out show's own ticketUrl must not produce a second one.
    expect(screen.getAllByRole('link', { name: 'Tickets' })).toHaveLength(1);
  });

  it('lists supporting acts when present', () => {
    render(<Shows />);
    expect(screen.getByText(/with Support Act/)).toBeInTheDocument();
  });

  it('never shows a Tickets/Event Info/Coming Soon action for past shows', () => {
    render(<Shows />);
    const pastRow = screen.getByText(/Old Venue/).closest('li');
    expect(pastRow).not.toBeNull();
    expect(pastRow!.textContent).not.toMatch(/Tickets|Event Info|Sold Out/);
  });
});
