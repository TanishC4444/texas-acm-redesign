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
    const dateKey = (d: Date) =>
        new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Chicago',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(d);
    if (dateKey(new Date(start)) === dateKey(now)) return 'Today';
    const local = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    const days = (7 - local.getDay()) % 7;
    const end = new Date(local);
    end.setDate(end.getDate() + days);
    return dateKey(new Date(start)) <= dateKey(end) ? 'This week' : 'Later';
}
