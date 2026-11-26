import { NextResponse } from 'next/server';
import ICAL from 'ical.js';
import { fromZonedTime } from 'date-fns-tz';
import { CALENDAR_ID, publicUrl, textOnly, type RuntimeEvent } from '@/lib/runtime-calendar';
export const dynamic = 'force-dynamic';
function calendarDate(value: ICAL.Time): Date {
    if (value.isDate || value.zone.tzid === 'floating') {
        return fromZonedTime(
            value.toString().slice(0, 10) +
                'T' +
                (value.isDate ? '00:00:00' : value.toString().slice(11, 19)),
            'America/Chicago',
        );
    }
    return value.toJSDate();
}
export async function GET() {
    try {
        const now = new Date();
        const until = new Date(now.getTime() + 180 * 86400000);
        let events: RuntimeEvent[] = [];
        const id = process.env.GOOGLE_CAL_ID || CALENDAR_ID;
        const key = process.env.GOOGLE_CAL_API_KEY;
        if (key) {
            const url = new URL(
                `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(id)}/events`,
            );
            url.search = new URLSearchParams({
                key,
                timeMin: now.toISOString(),
                timeMax: until.toISOString(),
                singleEvents: 'true',
                orderBy: 'startTime',
                maxResults: '100',
            }).toString();
            const r = await fetch(url, {
                next: { revalidate: 60 },
                signal: AbortSignal.timeout(10000),
            });
            if (!r.ok) throw Error('calendar');
            const data = await r.json();
            events = (data.items || [])
                .filter((e: { status: string }) => e.status !== 'cancelled')
                .map(
                    (e: {
                        id: string;
                        summary: string;
                        description?: string;
                        location?: string;
                        htmlLink: string;
                        start: { dateTime?: string; date?: string };
                        end: { dateTime?: string; date?: string };
                    }) => ({
                        id: e.id,
                        title: e.summary || 'Chapter event',
                        start:
                            e.start.dateTime ||
                            fromZonedTime(
                                e.start.date + 'T00:00:00',
                                'America/Chicago',
                            ).toISOString(),
                        end:
                            e.end.dateTime ||
                            fromZonedTime(
                                e.end.date + 'T00:00:00',
                                'America/Chicago',
                            ).toISOString(),
                        allDay: !e.start.dateTime,
                        location: e.location || '',
                        description: textOnly(e.description || ''),
                        url: publicUrl(e.htmlLink),
                    }),
                );
        } else {
            const r = await fetch(
                `https://calendar.google.com/calendar/ical/${encodeURIComponent(id)}/public/basic.ics`,
                { next: { revalidate: 60 }, signal: AbortSignal.timeout(10000) },
            );
            if (!r.ok) throw Error('calendar');
            const root = new ICAL.Component(ICAL.parse(await r.text()));
            for (const tz of root.getAllSubcomponents('vtimezone'))
                ICAL.TimezoneService.register(tz);
            const parts = root.getAllSubcomponents('vevent');
            const exceptions = parts.filter((c) => c.hasProperty('recurrence-id'));
            for (const part of parts) {
                if (
                    part.hasProperty('recurrence-id') ||
                    part.getFirstPropertyValue('status') === 'CANCELLED'
                )
                    continue;
                const e = new ICAL.Event(part);
                for (const ex of exceptions)
                    if (ex.getFirstPropertyValue('uid') === e.uid) e.relateException(ex);
                const add = (start: Date, end: Date, item: ICAL.Event, stamp: string) => {
                    if (end <= now || start > until) return;
                    events.push({
                        id: e.uid + stamp,
                        title: item.summary || 'Chapter event',
                        start: start.toISOString(),
                        end: end.toISOString(),
                        allDay: item.startDate.isDate,
                        location: item.location || '',
                        description: textOnly(item.description || ''),
                        url:
                            publicUrl(String(item.component.getFirstPropertyValue('url') || '')) ||
                            `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(id)}`,
                    });
                };
                if (e.isRecurring()) {
                    const it = e.iterator();
                    for (let n = 0; n < 10000; n++) {
                        const t = it.next();
                        if (!t || calendarDate(t) > until) break;
                        const occurrence = e.getOccurrenceDetails(t);
                        if (
                            occurrence.item.component.getFirstPropertyValue('status') !==
                            'CANCELLED'
                        )
                            add(
                                calendarDate(occurrence.startDate),
                                calendarDate(occurrence.endDate),
                                occurrence.item,
                                t.toString(),
                            );
                    }
                } else add(calendarDate(e.startDate), calendarDate(e.endDate), e, '');
            }
        }
        events = events
            .filter((e) => new Date(e.end) > now)
            .sort((a, b) => a.start.localeCompare(b.start))
            .slice(0, 100)
            .map((e) => ({
                ...e,
                rsvp:
                    publicUrl(e.description.match(/https:\/\/[^\s<>"')]+/i)?.[0] || '') ||
                    undefined,
            }));
        return NextResponse.json(
            { status: 'ready', events, updatedAt: now.toISOString() },
            { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=60' } },
        );
    } catch {
        return NextResponse.json(
            { status: 'error', events: [], message: 'Calendar unavailable. Open it directly.' },
            { status: 503 },
        );
    }
}
