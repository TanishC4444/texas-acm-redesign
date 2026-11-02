export const contentKinds = ['event', 'announcement', 'resource', 'form'] as const;
export type ContentKind = (typeof contentKinds)[number];
export type ContentStatus = 'draft' | 'published' | 'archived';
export interface ContentRecord {
    id: string;
    kind: ContentKind;
    title: string;
    description: string;
    category: string;
    date: string;
    location: string;
    url: string;
    image: string;
    status: ContentStatus;
    createdBy: string;
    updatedBy: string;
}
export type OfficerRole = 'editor' | 'admin';
export interface OfficerRecord {
    name: string;
    email: string;
    role: OfficerRole;
    active: boolean;
}
export const categories = ['Community', 'Academics', 'Industry', 'General'] as const;
export function safeUrl(value: string): boolean {
    if (!value) return true;
    try {
        const url = new URL(value);
        return url.protocol === 'https:';
    } catch {
        return false;
    }
}
export function validateContent(value: Partial<ContentRecord>): string | null {
    if (!contentKinds.includes(value.kind as ContentKind)) return 'Choose a content type.';
    if (!value.title?.trim() || value.title.length > 140)
        return 'Use a title between 1 and 140 characters.';
    if (!value.description?.trim() || value.description.length > 5000)
        return 'Use a description between 1 and 5,000 characters.';
    if (!categories.includes(value.category as (typeof categories)[number]))
        return 'Choose a category.';
    if (!['draft', 'published', 'archived'].includes(value.status || ''))
        return 'Choose a valid status.';
    if (!safeUrl(value.url || '') || !safeUrl(value.image || ''))
        return 'Links and images must use a full HTTPS address.';
    if (
        (value.url?.length || 0) > 2048 ||
        (value.image?.length || 0) > 2048 ||
        (value.location?.length || 0) > 200
    )
        return 'A link or location is too long.';
    if ((value.date?.length || 0) > 40 || (value.date && !Number.isFinite(Date.parse(value.date))))
        return 'Choose a valid date and time.';
    return null;
}
export const resourceLinks = [
    {
        title: 'CS A–Z',
        description: 'The unofficial dictionary of your UTCS life.',
        href: '/resources#atoz',
        label: 'THE FIELD GUIDE',
        icon: '↗',
    },
    {
        title: 'CS Guide',
        description: 'Classes, campus, careers. Start with the essentials.',
        href: '/resources#guide',
        label: 'START HERE',
        icon: '⌘',
    },
    {
        title: 'Resume book',
        description: 'Put your next opportunity within reach.',
        href: '/resources#resume',
        label: 'MAKE YOUR MOVE',
        icon: '↗',
    },
    {
        title: 'FAQ',
        description: 'Your questions, answered by your people.',
        href: '/resources#faq',
        label: 'GOOD TO KNOW',
        icon: '?',
    },
];
