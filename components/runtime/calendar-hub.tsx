'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, RefreshCw, ArrowUpRight } from 'lucide-react';
import { useRuntime } from './provider';
import { EventDetails } from './events';
import { usePublishedContent } from '@/components/revamp/live-content';
import {
    CALENDAR_ID,
    CALENDAR_URL,
    eventBucket,
    publicUrl,
    type RuntimeEvent,
} from '@/lib/runtime-calendar';

const timeZone = 'America/Chicago';
const shortDate = new Intl.DateTimeFormat('en-US', { timeZone, month: 'short', day: 'numeric' });
const shortTime = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
});

export default function CalendarHub() {
    const { status, events, now, refreshCalendar } = useRuntime();
    const { items, state: chapterStatus } = usePublishedContent('event');
    const [selectedId, setSelectedId] = useState<string>();
    const detailPanel = useRef<HTMLDivElement>(null);
    const today = new Date(now);
    const chapterEvents: RuntimeEvent[] = items
        .filter((item) => Number.isFinite(Date.parse(item.date)))
        .map((item) => ({
            id: 'chapter-' + item.id,
            title: item.title,
            start: item.date,
            end: item.date,
            allDay: false,
            location: item.location,
            description: item.description,
            url: publicUrl(item.url),
            image: publicUrl(item.image),
            source: 'chapter',
        }));
    const upcoming = [...events, ...chapterEvents]
        .filter((event) => now > 0 && Date.parse(event.end) > now)
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    const selected = upcoming.find((event) => event.id === selectedId) ?? upcoming[0];

    useEffect(() => {
        if (detailPanel.current) detailPanel.current.scrollTop = 0;
    }, [selected?.id]);

    useEffect(() => {
        function followBookmark() {
            let id: string;
            try {
                id = decodeURIComponent(location.hash.slice(1));
            } catch {
                return;
            }
            const row = document.getElementById(id);
            if (!row?.matches('#calendar .rt-event-row')) return;
            setSelectedId(id);
            row.scrollIntoView();
        }
        followBookmark();
        window.addEventListener('hashchange', followBookmark);
        return () => window.removeEventListener('hashchange', followBookmark);
    }, [status, items]);

    return (
        <section className="acm-calendar" id="calendar" aria-labelledby="calendar-heading">
            <header className="acm-section-heading">
                <div>
                    <p className="acm-eyebrow">MAKE ROOM FOR SOMETHING GOOD.</p>
                    <h2 id="calendar-heading">See you there.</h2>
                </div>
                <div className="acm-calendar-links">
                    <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                        Open calendar <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                    <a
                        href={`https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`}
                    >
                        Subscribe with iCal
                    </a>
                </div>
            </header>
            <div className="acm-calendar-layout" data-has-events={!!selected}>
                <div className="rt-agenda">
                    {!upcoming.length && (status === 'loading' || chapterStatus === 'loading') && (
                        <p className="acm-calendar-status" role="status">
                            Finding your next chapter event…
                        </p>
                    )}
                    {status === 'error' && (
                        <div className="acm-calendar-empty" role="status">
                            <h3>The calendar couldn’t load.</h3>
                            <p>
                                Try again, or open the chapter’s Google Calendar directly. Published
                                chapter events still appear below.
                            </p>
                            <button type="button" className="rt-button" onClick={refreshCalendar}>
                                <RefreshCw size={16} aria-hidden="true" /> Try again
                            </button>
                        </div>
                    )}
                    {status === 'ready' && chapterStatus !== 'loading' && !upcoming.length && (
                        <div className="acm-calendar-empty">
                            <h3>A little breathing room.</h3>
                            <p>
                                No upcoming events are listed right now. Join Discord for chapter
                                updates, or subscribe to the calendar so you’re ready for the next
                                one.
                            </p>
                            <a
                                className="acm-inline-link"
                                href="https://discord.gg/tspJCpFFKx"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Join the conversation <ArrowUpRight size={16} aria-hidden="true" />
                            </a>
                        </div>
                    )}
                    {upcoming.map((event, index) => {
                        const bucket = eventBucket(event.start, today);
                        const active = event.id === selected?.id;
                        const start = new Date(event.start);
                        const mobileId = 'mobile-detail-' + event.id;
                        return (
                            <div key={event.id}>
                                {(index === 0 ||
                                    eventBucket(upcoming[index - 1].start, today) !== bucket) && (
                                    <h3 className="rt-agenda-group">{bucket}</h3>
                                )}
                                <article
                                    className="rt-event-row"
                                    id={event.id}
                                    data-selected={active}
                                >
                                    <time dateTime={event.start}>
                                        {shortDate.format(start)}
                                        <span>
                                            {event.allDay ? 'All day' : shortTime.format(start)}
                                        </span>
                                    </time>
                                    <div>
                                        <button
                                            className="rt-event-title"
                                            aria-pressed={active}
                                            aria-controls={'calendar-event-detail ' + mobileId}
                                            onClick={() => setSelectedId(event.id)}
                                        >
                                            {event.title}
                                            <ArrowRight size={16} aria-hidden="true" />
                                        </button>
                                        {event.location && <p>{event.location}</p>}
                                        <div className="acm-event-mobile" id={mobileId}>
                                            {active && <EventDetails event={event} />}
                                        </div>
                                    </div>
                                </article>
                            </div>
                        );
                    })}
                </div>
                <aside className="acm-calendar-feature" aria-label="Calendar details">
                    <div
                        id="calendar-event-detail"
                        ref={detailPanel}
                        className="acm-event-desktop"
                        role="region"
                        aria-label="Selected event"
                        tabIndex={selected ? 0 : undefined}
                        aria-live="polite"
                    >
                        {!selected && (
                            <div className="acm-calendar-placeholder">
                                <CalendarDays size={38} strokeWidth={1.3} aria-hidden="true" />
                                <strong>Something to look forward to.</strong>
                                <p>
                                    Choose an event to see its time, location, and RSVP details
                                    here. All times are shown in Austin’s time zone.
                                </p>
                            </div>
                        )}
                        {selected && (
                            <div key={selected.id} className="acm-event-feature-copy">
                                <h3>{selected.title}</h3>
                                <p>
                                    <time dateTime={selected.start}>
                                        {new Intl.DateTimeFormat('en-US', {
                                            timeZone,
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            ...(selected.allDay
                                                ? {}
                                                : {
                                                      hour: 'numeric',
                                                      minute: '2-digit',
                                                      timeZoneName: 'short',
                                                  }),
                                        }).format(new Date(selected.start))}
                                    </time>
                                    {selected.allDay && ' · All day'}
                                </p>
                                {selected.location && <p>{selected.location}</p>}
                                <EventDetails event={selected} />
                            </div>
                        )}
                    </div>
                    <nav aria-label="Calendar links">
                        <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                            Google Calendar
                        </a>
                        <a
                            href={`https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`}
                        >
                            Subscribe with iCal
                        </a>
                    </nav>
                </aside>
            </div>
        </section>
    );
}
