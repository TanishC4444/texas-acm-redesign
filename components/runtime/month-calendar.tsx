'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dayKey, eventsOnDay, monthDays, moveMonth } from '@/lib/calendar-view';
import type { RuntimeEvent } from '@/lib/runtime-calendar';
import type { KeyboardEvent } from 'react';

const fullDate = (key: string) =>
    new Date(key + 'T12:00:00Z').toLocaleDateString('en-US', {
        timeZone: 'UTC',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

export default function MonthCalendar({
    events,
    month,
    setMonth,
    selectedDay,
    onSelect,
    now,
}: {
    events: RuntimeEvent[];
    month: string;
    setMonth: (month: string) => void;
    selectedDay: string | undefined;
    onSelect: (day: string) => void;
    now: number;
}) {
    const today = dayKey(now);
    const days = monthDays(month);
    const focusDay =
        selectedDay && days.includes(selectedDay)
            ? selectedDay
            : days.includes(today)
              ? today
              : month + '-01';
    function navigate(event: KeyboardEvent<HTMLButtonElement>, key: string) {
        const shifts: Record<string, number> = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -7,
            ArrowDown: 7,
        };
        let index = days.indexOf(key);
        if (event.key in shifts) index += shifts[event.key];
        else if (event.key === 'Home') index -= index % 7;
        else if (event.key === 'End') index += 6 - (index % 7);
        else return;
        event.preventDefault();
        const next = days[index];
        if (!next) return;
        onSelect(next);
        document.getElementById('calendar-day-' + next)?.focus();
    }
    return (
        <div className="acm-month">
            <div className="acm-month-heading">
                <h3 id="calendar-month-heading" aria-live="polite">
                    {new Date(month + '-01T12:00:00Z').toLocaleDateString('en-US', {
                        timeZone: 'UTC',
                        month: 'long',
                        year: 'numeric',
                    })}
                </h3>
                <div>
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => setMonth(moveMonth(month, -1))}
                    >
                        <ChevronLeft size={17} />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMonth(today.slice(0, 7));
                            onSelect(today);
                        }}
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => setMonth(moveMonth(month, 1))}
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>
            </div>
            <div className="acm-month-grid" role="grid" aria-labelledby="calendar-month-heading">
                <div role="row" className="acm-month-weekdays">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <span role="columnheader" key={day}>
                            {day}
                        </span>
                    ))}
                </div>
                {Array.from({ length: 6 }, (_, week) => (
                    <div role="row" className="acm-month-week" key={week}>
                        {days.slice(week * 7, week * 7 + 7).map((day) => {
                            const items = eventsOnDay(events, day);
                            return (
                                <div role="gridcell" aria-selected={day === selectedDay} key={day}>
                                    <button
                                        type="button"
                                        id={'calendar-day-' + day}
                                        tabIndex={day === focusDay ? 0 : -1}
                                        data-outside={!day.startsWith(month)}
                                        data-today={day === today}
                                        aria-current={day === today ? 'date' : undefined}
                                        aria-label={`${fullDate(day)}; ${items.length} upcoming ${items.length === 1 ? 'event' : 'events'}`}
                                        onKeyDown={(event) => navigate(event, day)}
                                        onClick={() => onSelect(day)}
                                    >
                                        <span className="acm-month-number">
                                            {Number(day.slice(-2))}
                                        </span>
                                        <span className="acm-month-event-label" aria-hidden="true">
                                            {items[0]?.title}
                                        </span>
                                        {items.length > 0 && (
                                            <span className="acm-month-dots" aria-hidden="true">
                                                {items.slice(0, 3).map((item) => (
                                                    <i key={item.id} />
                                                ))}
                                                {items.length > 3 && (
                                                    <small>+{items.length - 3}</small>
                                                )}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
