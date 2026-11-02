export const photoSlots = [
    {
        id: 'home',
        label: 'Homepage',
        src: '/studio/acmformal25.webp',
        alt: 'Texas ACM students at the chapter formal',
    },
    {
        id: 'about',
        label: 'About page',
        src: '/studio/acmretreat25.webp',
        alt: 'Texas ACM members at retreat',
    },
    {
        id: 'events',
        label: 'Events page',
        src: '/studio/familyfeud25.webp',
        alt: 'Texas ACM community event',
    },
    {
        id: 'academics',
        label: 'Academics',
        src: '/studio/pwp.webp',
        alt: 'Pancakes with Professors',
    },
    {
        id: 'industry',
        label: 'Industry',
        src: '/studio/acmformal25.webp',
        alt: 'Texas ACM chapter formal',
    },
    {
        id: 'community',
        label: 'Community',
        src: '/studio/familyfeud25.webp',
        alt: 'Texas ACM Family Feud',
    },
    {
        id: 'gallery-0',
        label: 'Gallery: first photo',
        src: '/studio/acmretreat25.webp',
        alt: 'Texas ACM members together at retreat',
    },
    {
        id: 'gallery-1',
        label: 'Gallery: second photo',
        src: '/studio/acmformal25.webp',
        alt: 'Texas ACM students at the chapter formal',
    },
    {
        id: 'gallery-2',
        label: 'Gallery: third photo',
        src: '/studio/familyfeud25.webp',
        alt: 'Texas ACM Family Feud event',
    },
    {
        id: 'gallery-3',
        label: 'Gallery: fourth photo',
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
