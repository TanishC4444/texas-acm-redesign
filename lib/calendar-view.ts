import type { RuntimeEvent } from './runtime-calendar';

const localDay = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});
export const dayKey = (value: string | number | Date) => localDay.format(new Date(value));

// UTC is used only for arithmetic on calendar labels, never for event display times.
export function monthDays(month: string) {
    const first = new Date(month + '-01T12:00:00Z');
    const offset = (first.getUTCDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, index) => {
        const day = new Date(first);
        day.setUTCDate(day.getUTCDate() - offset + index);
        return day.toISOString().slice(0, 10);
    });
}
export function moveMonth(month: string, direction: number) {
    const date = new Date(month + '-01T12:00:00Z');
    date.setUTCMonth(date.getUTCMonth() + direction);
    return date.toISOString().slice(0, 7);
}
export function eventsOnDay(events: RuntimeEvent[], key: string) {
    return eventsInRange(events, key, key);
}
export function eventsInMonth(events: RuntimeEvent[], month: string) {
    const end = new Date(moveMonth(month, 1) + '-01T12:00:00Z');
    end.setUTCDate(0);
    return eventsInRange(events, month + '-01', end.toISOString().slice(0, 10));
}
function eventsInRange(events: RuntimeEvent[], firstDay: string, lastDay: string) {
    return events.filter((event) => {
        const start = Date.parse(event.start);
        const end = Date.parse(event.end);
        if (!Number.isFinite(start)) return false;
        // End instants are exclusive, including all-day events and midnight boundaries.
        const last = Number.isFinite(end) && end > start ? end - 1 : start;
        return dayKey(start) <= lastDay && dayKey(last) >= firstDay;
    });
}
