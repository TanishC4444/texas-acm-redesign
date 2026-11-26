'use client';
import { useState } from 'react';
import type { RuntimeEvent } from '@/lib/runtime-calendar';
const date = (s: string, options: Intl.DateTimeFormatOptions) =>
    new Date(s).toLocaleDateString('en-US', { timeZone: 'America/Chicago', ...options });
export function EventDetails({ event }: { event: RuntimeEvent }) {
    const description = event.rsvp
        ? event.description
              .split('\n')
              .filter((line) => {
                  const text = line.trim().replace(/^RSVP(?: link)?\s*:\s*/i, '');
                  try {
                      return new URL(text).href !== event.rsvp;
                  } catch {
                      return true;
                  }
              })
              .join('\n')
              .trim()
        : event.description;
    return (
        <div className="acm-event-details">
            {event.image && (
                <img src={event.image} alt="" loading="lazy" referrerPolicy="no-referrer" />
            )}
            {description && <p>{description}</p>}
            <div className="acm-event-actions">
                {event.rsvp && (
                    <a
                        className="rt-button rt-primary"
                        href={event.rsvp}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        RSVP
                    </a>
                )}
                {event.url && (
                    <a
                        className="rt-text-link"
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {event.source === 'chapter'
                            ? 'Event details & RSVP'
                            : 'View in Google Calendar'}
                    </a>
                )}
            </div>
        </div>
    );
}

export function EventRow({ event }: { event: RuntimeEvent }) {
    const [expanded, setExpanded] = useState(false);
    const [preview, setPreview] = useState(false);
    const open = expanded || preview;

    return (
        <article
            className="rt-event-row"
            id={event.id}
            onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setPreview(true);
            }}
            onPointerLeave={() => setPreview(false)}
        >
            <time dateTime={event.start}>
                {date(event.start, { month: 'short', day: 'numeric' })}
                <span>
                    {event.allDay
                        ? 'All day'
                        : new Date(event.start).toLocaleTimeString('en-US', {
                              timeZone: 'America/Chicago',
                              hour: 'numeric',
                              minute: '2-digit',
                          })}
                </span>
            </time>
            <div>
                <button
                    className="rt-event-title"
                    aria-expanded={open}
                    aria-controls={'detail-' + event.id}
                    onClick={() => {
                        setExpanded(!expanded);
                        setPreview(false);
                    }}
                >
                    {event.title}
                </button>
                {event.location && <p>{event.location}</p>}
                <div
                    className="rt-event-reveal"
                    data-open={open}
                    aria-hidden={!open}
                    id={'detail-' + event.id}
                >
                    <div className="rt-event-detail">
                        <EventDetails event={event} />
                    </div>
                </div>
            </div>
        </article>
    );
}
