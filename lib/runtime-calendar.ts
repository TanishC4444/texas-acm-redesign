export const CALENDAR_ID = 'utacm.org_tblt9l9gskpcunjovsjfh8ei0g@group.calendar.google.com';
export const CALENDAR_URL = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=America%2FChicago`;
export type RuntimeEvent = {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    location: string;
    description: string;
    url: string;
    rsvp?: string;
    image?: string;
    source?: 'chapter';
};
export function textOnly(s: string) {
    return s
        .replace(/<br\s*\/?\s*>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .trim();
}
export function publicUrl(s: string) {
    try {
        const u = new URL(s);
        return u.protocol === 'https:' ? u.href : '';
    } catch {
        return '';
    }
}
export function eventBucket(start: string, now = new Date()) {
    // Compare Austin calendar dates without reinterpreting them in the server's timezone.
    const dateKey = (d: Date) => {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Chicago',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).formatToParts(d);
        const get = (type: string) => parts.find((part) => part.type === type)?.value;
        return `${get('year')}-${get('month')}-${get('day')}`;
    };
    const today = dateKey(now);
    const eventDay = dateKey(new Date(start));
    if (eventDay === today) return 'Today';
    const weekEnd = new Date(today + 'T12:00:00Z');
    weekEnd.setUTCDate(weekEnd.getUTCDate() + ((7 - weekEnd.getUTCDay()) % 7));
    return eventDay >= today && eventDay <= weekEnd.toISOString().slice(0, 10)
        ? 'This week'
        : 'Later';
}
