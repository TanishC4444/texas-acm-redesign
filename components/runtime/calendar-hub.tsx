'use client';

import { useEffect, useRef, useState } from 'react';
import {
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    List,
    Search,
    X,
    MapPin,
    Clock3,
    RefreshCw,
} from 'lucide-react';
import MonthCalendar from './month-calendar';
import { dayKey, eventsOnDay, eventsInMonth } from '@/lib/calendar-view';
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
    const [view, setView] = useState<'agenda' | 'month'>('agenda');
    const [query, setQuery] = useState('');
    const [month, setMonth] = useState<string>();
    const [selectedDay, setSelectedDay] = useState<string>();
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
        .filter(
            (event) => now > 0 && Math.max(Date.parse(event.start), Date.parse(event.end)) > now,
        )
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    const upcomingIds = upcoming.map((event) => event.id).join('\0');
    const currentMonth = month ?? (now > 0 ? dayKey(now).slice(0, 7) : undefined);
    const matching = upcoming.filter((event) =>
        [event.title, event.location, event.description]
            .join(' ')
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
    );
    const visible =
        view === 'agenda'
            ? matching
            : selectedDay
              ? eventsOnDay(matching, selectedDay)
              : currentMonth
                ? eventsInMonth(matching, currentMonth)
                : [];
    const selected = visible.find((event) => event.id === selectedId) ?? visible[0];
    function changeMonth(value: string) {
        setMonth(value);
        setSelectedDay(undefined);
    }
    function selectDay(value: string) {
        setSelectedDay(value);
        setSelectedId(undefined);
    }

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
            if (!upcomingIds.split('\0').includes(id)) return;
            setView('agenda');
            setQuery('');
            setSelectedDay(undefined);
            setSelectedId(id);
            requestAnimationFrame(() =>
                document.getElementById(id)?.scrollIntoView({ block: 'center' }),
            );
        }
        followBookmark();
        window.addEventListener('hashchange', followBookmark);
        return () => window.removeEventListener('hashchange', followBookmark);
    }, [upcomingIds]);

    return (
        <section className="acm-calendar" id="calendar" aria-labelledby="calendar-heading">
            <header className="acm-calendar-heading">
                <div>
                    <span className="acm-kicker">THE CHAPTER, IN MOTION</span>
                    <h2 id="calendar-heading">
                        Your next <em>good plan.</em>
                    </h2>
                    <p>Workshops, familiar faces, and something to look forward to.</p>
                </div>
                <a
                    className="acm-calendar-subscribe"
                    href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(CALENDAR_ID)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <CalendarDays size={17} aria-hidden="true" /> Add to my calendar{' '}
                    <ArrowUpRight size={15} aria-hidden="true" />
                </a>
            </header>
            <div className="acm-calendar-toolbar">
                <div className="acm-view-switch" role="group" aria-label="Calendar view">
                    <button
                        type="button"
                        aria-pressed={view === 'agenda'}
                        onClick={() => setView('agenda')}
                    >
                        <List size={16} aria-hidden="true" /> Agenda
                    </button>
                    <button
                        type="button"
                        aria-pressed={view === 'month'}
                        onClick={() => setView('month')}
                    >
                        <CalendarDays size={16} aria-hidden="true" /> Month
                    </button>
                </div>
                <div className="acm-event-search" role="search" aria-label="Calendar events">
                    <Search size={17} aria-hidden="true" />

                    <input
                        type="search"
                        aria-label="Search calendar events"
                        placeholder="Find your next event…"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    {query && (
                        <button
                            type="button"
                            aria-label="Clear event search"
                            onClick={() => setQuery('')}
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>
                <span className="acm-calendar-timezone">
                    <Clock3 size={13} aria-hidden="true" /> Austin time
                </span>
            </div>
            <div className="acm-calendar-layout" data-has-events={!!selected}>
                <div className="rt-agenda">
                    {view === 'month' && currentMonth && now > 0 && (
                        <MonthCalendar
                            events={matching}
                            month={currentMonth}
                            setMonth={changeMonth}
                            selectedDay={selectedDay}
                            onSelect={selectDay}
                            now={now}
                        />
                    )}
                    <div className="acm-agenda-caption" role="status">
                        <span>
                            {view === 'month' && selectedDay
                                ? new Date(selectedDay + 'T12:00:00Z').toLocaleDateString('en-US', {
                                      timeZone: 'UTC',
                                      month: 'long',
                                      day: 'numeric',
                                  })
                                : 'Upcoming events'}
                        </span>
                        <span>
                            {visible.length} {visible.length === 1 ? 'event' : 'events'}
                        </span>
                    </div>
                    {!upcoming.length && (status === 'loading' || chapterStatus === 'loading') && (
                        <p role="status">Loading calendar…</p>
                    )}
                    {status === 'error' && (
                        <div className="acm-calendar-alert" role="status">
                            <p>
                                The live calendar couldn’t load. Published chapter events still
                                appear below.
                            </p>
                            <button type="button" onClick={refreshCalendar}>
                                <RefreshCw size={15} aria-hidden="true" /> Try again
                            </button>
                        </div>
                    )}
                    {status === 'ready' && chapterStatus !== 'loading' && !upcoming.length && (
                        <p>No events scheduled.</p>
                    )}
                    {now > 0 && !visible.length && upcoming.length > 0 && (
                        <div className="acm-calendar-empty">
                            <CalendarDays size={28} aria-hidden="true" />
                            <h3>
                                {query ? 'No matches this time.' : 'An open spot on the calendar.'}
                            </h3>
                            <p>
                                {query
                                    ? 'Try another title, topic, or location.'
                                    : 'No upcoming events for this selection. Pick another day or browse the agenda.'}
                            </p>
                            <button
                                type="button"
                                className="rt-text-link"
                                onClick={() => {
                                    setQuery('');
                                    setSelectedDay(undefined);
                                    setView('agenda');
                                }}
                            >
                                Show all upcoming events <ArrowRight size={15} aria-hidden="true" />
                            </button>
                        </div>
                    )}
                    {visible.map((event, index) => {
                        const bucket = eventBucket(event.start, today);
                        const active = event.id === selected?.id;
                        const start = new Date(event.start);
                        const mobileId = 'mobile-detail-' + event.id;
                        return (
                            <div key={event.id}>
                                {(index === 0 ||
                                    eventBucket(visible[index - 1].start, today) !== bucket) && (
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
                            <div className="acm-event-placeholder">
                                <CalendarDays size={36} strokeWidth={1.2} aria-hidden="true" />
                                <p>Good things ahead.</p>
                                <span>Select an event to see the details here.</span>
                            </div>
                        )}
                        {selected && (
                            <div key={selected.id} className="acm-event-feature-copy">
                                <span className="acm-kicker">ON YOUR RADAR</span>
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
                                {selected.location && (
                                    <p className="acm-event-location">
                                        <MapPin size={15} aria-hidden="true" />
                                        {selected.location}
                                    </p>
                                )}
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
