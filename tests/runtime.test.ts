import { describe, it, expect, vi, afterEach } from 'vitest';
import { defaults, options, validateSettings, resolveContrast } from '../lib/runtime-settings';
import { eventBucket, publicUrl, textOnly } from '../lib/runtime-calendar';
import { deadlineStatus, normalizeDeadline } from '../lib/runtime-forms';
import { GET } from '../app/api/calendar/route';
describe('Runtime settings', () => {
    it('accepts every supported setting combination and round-trips share data', () => {
        let configurations = [{ ...defaults }];
        for (const [key, values] of Object.entries(options))
            configurations = configurations.flatMap((c) =>
                values.map((value) => ({ ...c, [key]: value })),
            );
        expect(configurations.length).toBe(720);
        for (const c of configurations)
            expect(validateSettings(JSON.parse(JSON.stringify(c)))).toEqual(c);
    });
    it('defaults dark mode to high contrast and light mode to standard', () => {
        expect(resolveContrast(defaults.contrast, true)).toBe('high');
        expect(resolveContrast(defaults.contrast, false)).toBe('standard');
        expect(resolveContrast('standard', true)).toBe('standard');
        expect(resolveContrast('high', false)).toBe('high');
    });
    it('rejects invalid hash and storage values', () => {
        expect(
            validateSettings({
                theme: 'javascript:bad',
                layout: 'unknown',
                motion: false,
                accent: ['blue'],
                text: '300',
            }),
        ).toEqual(defaults);
        expect(validateSettings(null)).toEqual(defaults);
        expect(validateSettings({ layout: 'read' }).layout).toBe('grid');
        expect(defaults.accent).toBe('green');
        expect(validateSettings({ density: 'compact', theme: 'dark' })).toEqual({
            ...defaults,
            theme: 'dark',
        });
    });
});
describe('Live calendar grouping and links', () => {
    it('groups by Central dates rather than UTC midnight', () => {
        const now = new Date('2026-11-08T01:00:00Z');
        expect(eventBucket('2026-11-08T03:00:00Z', now)).toBe('Today');
        expect(eventBucket('2026-11-08T16:00:00Z', now)).toBe('This week');
        expect(eventBucket('2026-11-10T16:00:00Z', now)).toBe('Later');
    });
    it('strips calendar HTML and rejects unsafe URLs', () => {
        expect(textOnly('Hello<br><b>ACM</b> &amp; friends')).toBe('Hello\nACM & friends');
        expect(publicUrl('javascript:alert(1)')).toBe('');
        expect(publicUrl('https://forms.gle/example')).toBe('https://forms.gle/example');
    });
});
describe('Form deadlines', () => {
    it('uses Central end-of-day and observes daylight saving', () => {
        expect(normalizeDeadline('2026-07-01')).toBe('2026-07-02T04:59:59.000Z');
        expect(normalizeDeadline('11/07/2026')).toBe('2026-11-08T05:59:59.000Z');
    });
    it('archives closed forms and marks closing deadlines', () => {
        const now = Date.parse('2026-11-07T18:00:00Z');
        expect(deadlineStatus(undefined, now)).toBe('Open');
        expect(deadlineStatus('2026-11-06T18:00:00Z', now)).toBe('Closed');
        expect(deadlineStatus('2026-11-08T18:00:00Z', now)).toBe('Closes soon');
        expect(deadlineStatus('bad', now)).toBe('Check deadline');
    });
});
afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.unstubAllEnvs();
});
it('reads the public calendar, expands recurring events and drops cancelled occurrences', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-07T18:00:00Z'));
    vi.stubEnv('GOOGLE_CAL_API_KEY', '');
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Runtime Test//EN',
        'BEGIN:VEVENT',
        'UID:test-series',
        'DTSTART:20261108T180000Z',
        'DTEND:20261108T190000Z',
        'RRULE:FREQ=DAILY;COUNT=3',
        'SUMMARY:Chapter workshop',
        'DESCRIPTION:RSVP https://forms.gle/example',
        'END:VEVENT',
        'BEGIN:VEVENT',
        'UID:test-series',
        'RECURRENCE-ID:20261109T180000Z',
        'DTSTART:20261109T180000Z',
        'DTEND:20261109T190000Z',
        'SUMMARY:Cancelled workshop',
        'STATUS:CANCELLED',
        'END:VEVENT',
        'BEGIN:VEVENT',
        'UID:past',
        'DTSTART:20261101T180000Z',
        'DTEND:20261101T190000Z',
        'SUMMARY:Past event',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(ics, { status: 200 }));
    const r = await GET();
    const body = await r.json();
    expect(r.status).toBe(200);
    expect(body.events).toHaveLength(2);
    expect(body.events.map((e: { start: string }) => e.start)).toEqual([
        '2026-11-08T18:00:00.000Z',
        '2026-11-10T18:00:00.000Z',
    ]);
    expect(body.events[0].rsvp).toBe('https://forms.gle/example');
});
it('distinguishes a calendar outage from a valid empty feed', async () => {
    vi.stubEnv('GOOGLE_CAL_API_KEY', '');
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const r = await GET();
    expect(r.status).toBe(503);
    expect((await r.json()).status).toBe('error');
});

it.each([
    [
        'DTSTART;VALUE=DATE:20261108',
        'DTEND;VALUE=DATE:20261109',
        '2026-11-08T06:00:00.000Z',
        '2026-11-09T06:00:00.000Z',
    ],
    [
        'DTSTART:20261109T180000',
        'DTEND:20261109T190000',
        '2026-11-10T00:00:00.000Z',
        '2026-11-10T01:00:00.000Z',
    ],
])('keeps Austin dates for %s across DST', async (start, end, expectedStart, expectedEnd) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-07T18:00:00Z'));
    vi.stubEnv('GOOGLE_CAL_API_KEY', '');
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ACM//Calendar//EN',
        'BEGIN:VEVENT',
        'UID:local-event',
        start,
        end,
        'SUMMARY:Chapter event',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(ics, { status: 200 }));
    const response = await GET();
    expect(response.status).toBe(200);
    expect((await response.json()).events).toEqual([
        expect.objectContaining({ start: expectedStart, end: expectedEnd }),
    ]);
});
