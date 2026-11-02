import { describe, expect, it } from 'vitest';
import { normalizeInstagramPosts } from '../lib/instagram-data';
const photo = {
    id: '1',
    media_type: 'IMAGE',
    media_url: 'https://scontent.cdninstagram.com/photo.jpg',
    permalink: 'https://www.instagram.com/p/chapter/',
    timestamp: '2026-10-30T12:00:00Z',
    caption: 'ACM workshop',
};
describe('public Instagram feed normalization', () => {
    it('orders posts by date and uses reel thumbnails instead of video files', () => {
        const result = normalizeInstagramPosts([
            photo,
            {
                ...photo,
                id: '2',
                timestamp: '2026-11-01T12:00:00Z',
                media_type: 'VIDEO',
                media_url: 'https://scontent.cdninstagram.com/video.mp4',
                thumbnail_url: 'https://scontent.cdninstagram.com/cover.jpg',
            },
        ]);
        expect(result.map((p) => p.id)).toEqual(['2', '1']);
        expect(result[0].image).toContain('cover.jpg');
    });
    it('rejects unsafe destinations, deceptive CDN domains, and invalid dates', () => {
        expect(
            normalizeInstagramPosts([
                { ...photo, permalink: 'javascript:alert(1)' },
                { ...photo, media_url: 'https://cdninstagram.com.attacker.test/photo.jpg' },
                { ...photo, timestamp: 'not a date' },
                { ...photo, media_url: 'http://scontent.cdninstagram.com/photo.jpg' },
            ]),
        ).toEqual([]);
    });
    it('limits public records to six, strips extra fields, and bounds captions', () => {
        const result = normalizeInstagramPosts(
            Array.from({ length: 12 }, (_, i) => ({
                ...photo,
                id: String(i),
                caption: 'x'.repeat(3000),
                private_value: 'secret',
            })),
        );
        expect(result).toHaveLength(6);
        expect(result[0].caption).toHaveLength(2200);
        expect(result[0]).not.toHaveProperty('private_value');
    });
    it('handles malformed upstream responses without publishing invalid records', () => {
        expect(normalizeInstagramPosts(null)).toEqual([]);
        expect(normalizeInstagramPosts([null, 4, {}, { ...photo, media_type: 'VIDEO' }])).toEqual(
            [],
        );
    });
});
