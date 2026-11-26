export const directoryKinds = [
    'glossary',
    'faq',
    'link',
    'contact',
    'partner',
    'officer',
    'form',
] as const;
export type DirectoryKind = (typeof directoryKinds)[number];
export const partnerTiers = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Banner only'] as const;

export interface DirectoryEntry {
    id: string;
    kind: DirectoryKind;
    title: string;
    description: string;
    category: string;
    url: string;
    image: string;
    links: string;
    hidden: boolean;
}

export function directoryEntry(
    kind: DirectoryKind,
    id: string,
    title = '',
    patch: Partial<DirectoryEntry> = {},
): DirectoryEntry {
    return {
        id,
        kind,
        title,
        description: '',
        category: '',
        url: '',
        image: '',
        links: '',
        hidden: false,
        ...patch,
    };
}

export function safeSiteLink(url: string, allowEmail = false) {
    if (/^\/(?!\/)[^\s\\]*$/.test(url)) return true;
    if (allowEmail && /^mailto:[^\s@?]+@[^\s@?]+\.[^\s@?]+$/i.test(url)) return true;
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' && !parsed.username && !parsed.password;
    } catch {
        return false;
    }
}

export function safeDirectoryImage(url: string) {
    return /^\/(studio|partners|network-comp)\/[A-Za-z0-9_./-]+\.(webp|png|jpe?g|svg)$/i.test(url)
        ? !url.includes('..')
        : url.startsWith('https://') && safeSiteLink(url);
}

export function validateDirectory(entry: DirectoryEntry) {
    if (!entry.title.trim() || entry.title.length > 160)
        return 'Enter a title of up to 160 characters.';
    if (entry.description.length > 5000 || entry.category.length > 120)
        return 'Shorten the description or category.';
    if (
        entry.url.length > 2048 ||
        (entry.url && !safeSiteLink(entry.url, entry.kind === 'contact'))
    )
        return 'Use an HTTPS link, a site path, or a mailto address for contacts.';
    if (entry.image.length > 2048 || (entry.image && !safeDirectoryImage(entry.image)))
        return 'Use an HTTPS image URL or a chapter asset path.';
    if (['link', 'contact', 'partner', 'form'].includes(entry.kind) && !entry.url)
        return 'Add a destination for this item.';
    if (entry.kind === 'partner' && !partnerTiers.some((tier) => tier === entry.category))
        return 'Choose a partnership tier or Banner only.';
    if (['faq', 'glossary'].includes(entry.kind) && !entry.description.trim())
        return 'Add the answer or definition.';
    if (entry.kind === 'officer' && !entry.category.trim()) return 'Enter the officer’s role.';
    if (entry.kind === 'form' && entry.category && !Number.isFinite(Date.parse(entry.category)))
        return 'Enter a valid deadline.';
    if (
        entry.links.length > 4000 ||
        entry.links
            .split('\n')
            .some(
                (link) =>
                    link.trim() &&
                    (!link.trim().startsWith('https://') || !safeSiteLink(link.trim())),
            )
    )
        return 'Use one HTTPS profile link per line.';
    return null;
}

export function mergeDirectory(
    defaults: DirectoryEntry[],
    updates: DirectoryEntry[],
    kind: DirectoryKind,
) {
    const entries = new Map(defaults.map((entry) => [entry.id, entry]));
    for (const entry of updates) {
        if (entry.kind !== kind) continue;
        const base = entries.get(entry.id);
        entries.set(entry.id, entry.hidden && base ? { ...base, hidden: true } : entry);
    }
    return [...entries.values()];
}

export function directoryAnchor(entry: DirectoryEntry) {
    return entry.id.replace(/^(term|faq|form)-/, '');
}
