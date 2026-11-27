import { fromZonedTime } from 'date-fns-tz';
export function normalizeDeadline(value: string | undefined): string | undefined {
    if (!value) return undefined;
    if (/T.*(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)) return value;
    const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    const local = match
        ? `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`
        : value;
    try {
        return fromZonedTime(
            /^\d{4}-\d{2}-\d{2}$/.test(local) ? local + 'T23:59:59' : local,
            'America/Chicago',
        ).toISOString();
    } catch {
        return value;
    }
}
export function deadlineStatus(deadline: string | undefined, now: number) {
    if (!deadline) return 'Open';
    const end = Date.parse(deadline);
    if (!Number.isFinite(end)) return 'Check deadline';
    return end < now ? 'Closed' : end - now < 72 * 3600000 ? 'Closes soon' : 'Open';
}
