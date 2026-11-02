import { describe, expect, it } from 'vitest';
import { validateContent, safeUrl } from '../lib/content';
const record = {
    kind: 'event' as const,
    title: 'Workshop',
    description: 'Bring your curiosity.',
    category: 'Academics',
    status: 'draft' as const,
    date: '2026-11-14T17:00:00.000Z',
    location: 'GDC',
    url: 'https://example.com/rsvp',
    image: '',
};
describe('content validation', () => {
    it('accepts a complete draft', () => expect(validateContent(record)).toBeNull());
    it.each(['javascript:alert(1)', 'data:text/html,test', 'http://example.com', '//example.com'])(
        'rejects unsafe destinations %s',
        (url) => expect(validateContent({ ...record, url })).toBeTruthy(),
    );
    it('rejects whitespace-only content', () =>
        expect(validateContent({ ...record, title: ' ' })).toBeTruthy());
    it('rejects an invalid date', () =>
        expect(validateContent({ ...record, date: 'not a date' })).toBeTruthy());
    it('rejects unrecognized status and kind', () => {
        expect(validateContent({ ...record, status: 'private' as 'draft' })).toBeTruthy();
        expect(validateContent({ ...record, kind: 'officer' as 'event' })).toBeTruthy();
    });
    it('permits an absent optional link', () => expect(safeUrl('')).toBe(true));
});
