import { shows } from '../data/shows';
import { formatShowDate, isUpcoming } from '../utils/formatDate';
import { getMapsUrl } from '../utils/maps';
import { getCalendarUrl } from '../utils/calendar';
import { usePageTitle } from '../hooks/usePageTitle';
import PinMark from '../components/icons/PinMark';
import CalendarMark from '../components/icons/CalendarMark';
import type { Show } from '../types/content';
import './Shows.css';

/**
 * Shows
 * -----
 * Full list of shows from `src/data/shows.ts`, automatically split into
 * "Upcoming" (sorted soonest-first) and "Past" (sorted most-recent-first)
 * sections based on today's date — you don't need to move entries
 * between lists yourself as dates pass.
 */
function Shows() {
  usePageTitle('Shows');

  // Copy + sort rather than mutating the imported `shows` array
  // directly — `.sort()` mutates in place, and mutating imported data is
  // a common source of confusing bugs (every page that imports `shows`
  // would see the reordered array).
  const upcoming = [...shows]
    .filter((show) => isUpcoming(show.date))
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = [...shows]
    .filter((show) => !isUpcoming(show.date))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="container section shows-page">
      <span className="eyebrow">Live</span>
      <h1>Shows</h1>

      <ShowList title="Upcoming" showsList={upcoming} emptyMessage="No shows booked yet — check back soon!" />
      {past.length > 0 && <ShowList title="Past" showsList={past} pastStyle />}
    </div>
  );
}

interface ShowListProps {
  title: string;
  showsList: Show[];
  emptyMessage?: string;
  pastStyle?: boolean;
}

/**
 * ShowList
 * --------
 * Renders one section (Upcoming/Past) of the shows list. Pulled out as
 * its own small component since Upcoming and Past need the exact same
 * markup, just with different data and a "past" styling flag.
 */
function ShowList({ title, showsList, emptyMessage, pastStyle = false }: ShowListProps) {
  return (
    <section className="show-list">
      <h2 className="show-list__heading">{title}</h2>

      {showsList.length === 0 && emptyMessage ? (
        <p className="show-list__empty">{emptyMessage}</p>
      ) : (
        <ul className={`show-list__items ${pastStyle ? 'is-past' : ''}`.trim()}>
          {showsList.map((show) => {
            // When there's no ticket link and no info link, an address
            // takes over the action column as a "Directions" button
            // instead of plain "Event Info Coming Soon" — for a show
            // where all that's known yet is where (and maybe when), not
            // a ticket link or a flyer to point to. In every other case
            // (sold out, has tickets, has an info link), the address —
            // if there is one — shows as a small "Directions" link next
            // to the venue instead, so it's still there without
            // duplicating it in both places.
            const addressIsPrimaryAction = !show.soldOut && !show.ticketUrl && !show.infoUrl && show.address;

            return (
              <li key={show.id} className="show-row">
                <span className="show-row__date">{formatShowDate(show.date)}</span>

                <span className="show-row__details">
                  <span className="show-row__venue">
                    {show.venue} — {show.city}, {show.state}
                    {show.address && !addressIsPrimaryAction && (
                      <a
                        href={getMapsUrl(show.address)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="show-row__directions"
                      >
                        <PinMark size={12} />
                        Directions
                      </a>
                    )}
                  </span>
                  {/* Shown whenever a time is set, independent of
                      ticket/info/address state — knowing when doors or
                      the show itself is matters regardless of whether
                      there's also a ticket link. Links out to a Google
                      Calendar "add event" prefilled from the show. */}
                  {show.time && (
                    <a
                      href={getCalendarUrl(show)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="show-row__time"
                    >
                      <CalendarMark size={12} />
                      {show.time}
                    </a>
                  )}
                  {show.supportedBy?.length > 0 && (
                    <span className="show-row__support">with {show.supportedBy.join(', ')}</span>
                  )}
                </span>

                {/* Past shows don't get a Tickets/Event Info/Coming Soon
                    button at all — none of that is relevant once a show
                    has already happened. */}
                {!pastStyle && (
                  <span className="show-row__action">
                    {show.soldOut ? (
                      <span className="badge badge--sold-out">Sold Out</span>
                    ) : show.ticketUrl ? (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn--outline btn--small"
                      >
                        Tickets
                      </a>
                    ) : show.infoUrl ? (
                      <a
                        href={show.infoUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn--outline btn--small"
                      >
                        Event Info
                      </a>
                    ) : addressIsPrimaryAction ? (
                      <a
                        href={getMapsUrl(show.address!)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn--outline btn--small"
                      >
                        Directions
                      </a>
                    ) : (
                      <span className="show-row__tba">Event Info Coming Soon</span>
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Shows;
