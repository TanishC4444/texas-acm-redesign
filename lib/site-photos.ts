export const photoSlots = [
    {
        id: 'home',
        label: 'Homepage hero: first photo',
        src: '/studio/acmformal25.webp',
        alt: 'Texas ACM students at the chapter formal',
    },
    {
        id: 'about',
        label: 'About page hero',
        src: '/studio/acmretreat25.webp',
        alt: 'Texas ACM members at retreat',
    },
    {
        id: 'events',
        label: 'Homepage hero: third photo',
        src: '/studio/family-feud.webp',
        alt: 'Texas ACM community event',
    },
    {
        id: 'industry',
        label: 'Partnerships hero and homepage Industry photo',
        src: '/studio/acmformal25.webp',
        alt: 'Texas ACM chapter formal',
    },
    {
        id: 'community',
        label: 'Homepage Community photo',
        src: '/studio/family-feud.webp',
        alt: 'Texas ACM Family Feud',
    },
    {
        id: 'academics',
        label: 'Homepage Academics photo',
        src: '/studio/pwp.webp',
        alt: 'Texas ACM students meeting professors',
    },
    {
        id: 'gallery-0',
        label: 'Homepage chapter photo',
        src: '/studio/acmretreat25.webp',
        alt: 'Texas ACM members together at retreat',
    },
    {
        id: 'gallery-1',
        label: 'Homepage hero: second photo',
        src: '/studio/pwp.webp',
        alt: 'Students meeting professors at Texas ACM',
    },
    {
        id: 'gallery-2',
        label: 'Chapter gallery: third photo',
        src: '/studio/family-feud.webp',
        alt: 'Texas ACM Family Feud event',
    },
    {
        id: 'gallery-3',
        label: 'Homepage Instagram photo',
        src: '/studio/acmhand25.webp',
        alt: 'Texas ACM members at a campus organization table',
    },
] as const;
export const chapterLibrary = [...new Set(photoSlots.map((p) => p.src))];
export function validPhotoUrl(value: string) {
    return /^\/studio\/[a-zA-Z0-9/_-]+\.webp$/.test(value) || /^https:\/\/[^\s]+$/.test(value);
}
export interface SitePhoto {
    url: string;
    alt: string;
}
