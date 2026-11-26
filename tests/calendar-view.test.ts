import { describe, expect, it } from 'vitest';
import { dayKey, eventsOnDay, eventsInMonth, monthDays, moveMonth } from '../lib/calendar-view';
import { eventBucket, type RuntimeEvent } from '../lib/runtime-calendar';

function event(start: string, end: string): RuntimeEvent {
    return {
        id: 'test',
        title: 'Test event',
        start,
        end,
        allDay: false,
        location: '',
        description: '',
        url: '',
    };
}

describe('Calendar month navigation', () => {
    it('starts on Monday and includes the leap day in a stable six-week grid', () => {
        const days = monthDays('2028-02');
        expect(days).toHaveLength(42);
        expect(days[0]).toBe('2028-01-31');
        expect(days[41]).toBe('2028-03-12');
        expect(days).toContain('2028-02-29');
        expect(new Set(days).size).toBe(42);
    });
    it('crosses years without changing the requested month', () => {
        expect(moveMonth('2026-12', 1)).toBe('2027-01');
        expect(moveMonth('2026-01', -1)).toBe('2025-12');
    });
});

describe('Event dates in Austin', () => {
    it('includes events that continue into the next month without duplicating an exclusive end', () => {
        const spanning = event('2026-12-01T05:00:00Z', '2026-12-02T06:00:00Z');
        expect(eventsInMonth([spanning], '2026-11')).toHaveLength(1);
        expect(eventsInMonth([spanning], '2026-12')).toHaveLength(1);
        expect(eventsInMonth([spanning], '2027-01')).toHaveLength(0);
        const midnight = event('2026-11-30T18:00:00Z', '2026-12-01T06:00:00Z');
        expect(eventsInMonth([midnight], '2026-12')).toHaveLength(0);
    });
    it('keeps late-night events on the Austin date across the daylight saving change', () => {
        expect(dayKey('2026-11-08T04:30:00Z')).toBe('2026-11-07');
        expect(dayKey('2026-11-09T05:30:00Z')).toBe('2026-11-08');
        const overnight = event('2026-11-08T04:30:00Z', '2026-11-08T09:30:00Z');
        expect(eventsOnDay([overnight], '2026-11-07')).toHaveLength(1);
        expect(eventsOnDay([overnight], '2026-11-08')).toHaveLength(1);
    });
    it('does not add an event to the day on which it ends at midnight', () => {
        const allDay = event('2026-11-07T05:00:00Z', '2026-11-09T06:00:00Z');
        expect(eventsOnDay([allDay], '2026-11-07')).toHaveLength(1);
        expect(eventsOnDay([allDay], '2026-11-08')).toHaveLength(1);
        expect(eventsOnDay([allDay], '2026-11-09')).toHaveLength(0);
    });
    it('includes published events that only specify their start instant', () => {
        const published = event('2026-12-04T02:00:00Z', '2026-12-04T02:00:00Z');
        expect(eventsOnDay([published], '2026-12-03')).toHaveLength(1);
        expect(eventsOnDay([published], '2026-12-04')).toHaveLength(0);
        expect(eventsOnDay([event('bad', 'bad')], '2026-12-03')).toHaveLength(0);
    });
    it('keeps Monday out of this week during late Sunday in Austin', () => {
        const sundayNight = new Date('2026-11-09T05:30:00Z');
        expect(eventBucket('2026-11-09T05:45:00Z', sundayNight)).toBe('Today');
        expect(eventBucket('2026-11-09T18:00:00Z', sundayNight)).toBe('Later');
    });
});
