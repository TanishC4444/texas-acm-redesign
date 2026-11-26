export interface InstagramPost {
    id: string;
    caption: string;
    permalink: string;
    image: string;
    timestamp: string;
    type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}
function allowedUrl(value: unknown, media = false): string {
    if (typeof value !== 'string') return '';
    try {
        const u = new URL(value);
        if (u.protocol !== 'https:') return '';
        const host = u.hostname.toLowerCase();
        if (
            media
                ? ['cdninstagram.com', 'fbcdn.net'].some(
                      (d) => host === d || host.endsWith('.' + d),
                  )
                : (host === 'instagram.com' || host === 'www.instagram.com') &&
                  /^\/(p|reel|tv)\//.test(u.pathname)
        )
            return u.href;
    } catch {
        /* Invalid URLs are rejected below. */
    }
    return '';
}
export function normalizeInstagramPosts(data: unknown): InstagramPost[] {
    if (!Array.isArray(data)) return [];
    return data
        .flatMap((item): InstagramPost[] => {
            if (!item || typeof item !== 'object') return [];
            const type = item.media_type;
            const permalink = allowedUrl(item.permalink);
            const image = allowedUrl(type === 'VIDEO' ? item.thumbnail_url : item.media_url, true);
            const date = typeof item.timestamp === 'string' ? Date.parse(item.timestamp) : NaN;
            if (
                !['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'].includes(type) ||
                !permalink ||
                !image ||
                !Number.isFinite(date) ||
                typeof item.id !== 'string'
            )
                return [];
            return [
                {
                    id: item.id,
                    type,
                    permalink,
                    image,
                    timestamp: new Date(date).toISOString(),
                    caption: typeof item.caption === 'string' ? item.caption.slice(0, 2200) : '',
                },
            ];
        })
        .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
        .slice(0, 6);
}

export function instagramEmbedUrl(permalink: string): string | undefined {
    const safe = allowedUrl(permalink);
    if (!safe) return undefined;
    const match = /^\/(p|reel|tv)\/([A-Za-z0-9_-]+)\/?$/.exec(new URL(safe).pathname);
    return match ? `https://www.instagram.com/${match[1]}/${match[2]}/embed/` : undefined;
}
