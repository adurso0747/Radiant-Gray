import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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
      // A show can have a ticket link, an address, and a time all at
      // once — this fixture covers that combination, since time is
      // shown independent of the other fields.
      address: '123 Main St, Testville, TS 00000',
      time: '7:00 PM',
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
      address: null,
      time: null,
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
      address: null,
      time: null,
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
      address: null,
      time: null,
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
      address: null,
      time: null,
      ticketUrl: 'https://example.com/tickets',
      infoUrl: null,
      soldOut: false,
      supportedBy: [],
    },
    {
      id: 'upcoming-address-only',
      date: '2026-07-05',
      venue: 'House Show Venue',
      city: 'Testville',
      state: 'TS',
      // Address but no ticket/info link yet — a "Directions" button
      // should take over the action column instead of "Event Info
      // Coming Soon".
      address: '456 Side St, Testville, TS 00000',
      time: '8:00 PM',
      ticketUrl: null,
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

  it('shows an inline Directions link to Google Maps when a show has an address plus tickets/info', () => {
    render(<Shows />);
    const row = screen.getByText(/Ticketed Venue/).closest('li');
    expect(row).not.toBeNull();
    const directions = within(row!).getByRole('link', { name: /directions/i });
    expect(directions).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=123%20Main%20St%2C%20Testville%2C%20TS%2000000',
    );
  });

  it('shows a Directions button in the action column instead of "Event Info Coming Soon" when there is an address but no ticket/info link', () => {
    render(<Shows />);
    const row = screen.getByText(/House Show Venue/).closest('li');
    expect(row).not.toBeNull();
    expect(row!.textContent).not.toMatch(/Event Info Coming Soon/);

    const directions = within(row!).getByRole('link', { name: /directions/i });
    expect(directions).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=456%20Side%20St%2C%20Testville%2C%20TS%2000000',
    );
  });

  it('shows a time as a link to add the show to Google Calendar, independent of tickets/info/address', () => {
    render(<Shows />);

    // 'Ticketed Venue' has a ticketUrl *and* a time — the time still
    // shows up as its own calendar link alongside the Tickets button.
    const ticketedRow = screen.getByText(/Ticketed Venue/).closest('li');
    expect(ticketedRow).not.toBeNull();
    const ticketedTime = within(ticketedRow!).getByRole('link', { name: /7:00 PM/ });
    expect(ticketedTime).toHaveAttribute('href', expect.stringContaining('https://www.google.com/calendar/render?'));
    expect(ticketedTime).toHaveAttribute('href', expect.stringContaining('text=Radiant+Gray+at+Ticketed+Venue'));
    expect(ticketedTime).toHaveAttribute('href', expect.stringContaining('dates=20260701%2F20260702'));

    // 'House Show Venue' has a time but no ticketUrl/infoUrl — the time
    // link still shows up even though the action column shows Directions.
    const addressOnlyRow = screen.getByText(/House Show Venue/).closest('li');
    expect(addressOnlyRow).not.toBeNull();
    expect(within(addressOnlyRow!).getByRole('link', { name: /8:00 PM/ })).toHaveAttribute(
      'href',
      expect.stringContaining('location=456+Side+St%2C+Testville%2C+TS+00000'),
    );
  });

  it('does not show a time link when no time is set', () => {
    render(<Shows />);
    // Only 'Ticketed Venue' and 'House Show Venue' have a time set.
    expect(screen.getAllByRole('link', { name: /PM/ })).toHaveLength(2);
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
