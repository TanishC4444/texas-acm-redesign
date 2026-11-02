'use client';
import { useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { ContentRecord, ContentKind } from '@/lib/content';
import { firebaseApp, firebaseConfigured } from '@/lib/firebase/app';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
export function usePublishedContent(kind: ContentKind) {
    const [items, setItems] = useState<ContentRecord[]>([]);
    const [state, setState] = useState<'loading' | 'ready' | 'unavailable'>(
        firebaseConfigured ? 'loading' : 'unavailable',
    );
    useEffect(() => {
        if (!firebaseConfigured) return;
        const db = getFirestore(firebaseApp());
        return onSnapshot(
            query(
                collection(db, 'content'),
                where('status', '==', 'published'),
                where('kind', '==', kind),
            ),
            (snapshot) => {
                setItems(
                    snapshot.docs
                        .map((d) => ({ ...d.data(), id: d.id }) as ContentRecord)
                        .sort((a, b) => a.date.localeCompare(b.date)),
                );
                setState('ready');
            },
            () => setState('unavailable'),
        );
    }, [kind]);
    return { items, state };
}
export function PublishedCards({
    kind,
    limit,
    hideEmpty = false,
}: {
    kind: ContentKind;
    limit?: number;
    hideEmpty?: boolean;
}) {
    const { items, state } = usePublishedContent(kind);
    const visible = (
        kind === 'event'
            ? items.filter((i) => !i.date || new Date(i.date).getTime() >= Date.now())
            : items
    ).slice(0, limit);
    if (state === 'loading')
        return (
            <p className="status-note" role="status">
                Loading the latest from ACM…
            </p>
        );
    if (!visible.length && hideEmpty) return null;
    if (!visible.length)
        return kind === 'event' ? (
            <div className="event-empty">
                <CalendarDays size={28} />
                <div>
                    <h3>
                        {state === 'unavailable' ? 'Texas ACM calendar' : 'Upcoming chapter events'}
                    </h3>
                    <p>
                        {state === 'unavailable'
                            ? 'The live event feed is unavailable here. Check our shared calendar for the current schedule.'
                            : 'Check the shared calendar for the current chapter schedule.'}
                    </p>
                </div>
                <a className="text-link" href="/calendar">
                    Open calendar <ArrowUpRight size={17} />
                </a>
            </div>
        ) : null;
    return (
        <div className="content-grid">
            {visible.map((item) => (
                <article
                    className={`story-card story-${item.category.toLowerCase()}`}
                    key={item.id}
                >
                    {item.image && (
                        <div className="story-image">
                            <img
                                src={item.image}
                                alt=""
                                loading="lazy"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    )}
                    <div className="story-body">
                        <span className="eyebrow">
                            {item.category} / {kind}
                        </span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        {item.date && Number.isFinite(Date.parse(item.date)) && (
                            <span className="event-meta">
                                <CalendarDays size={15} />
                                {new Intl.DateTimeFormat('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                    timeZone: 'America/Chicago',
                                }).format(new Date(item.date))}{' '}
                                CT
                            </span>
                        )}
                        {item.location && (
                            <span className="event-meta">
                                <MapPin size={15} />
                                {item.location}
                            </span>
                        )}
                        {item.url && (
                            <a
                                className="text-link"
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {kind === 'event' ? 'Details & RSVP' : 'Open resource'}
                                <ArrowUpRight size={17} />
                            </a>
                        )}
                    </div>
                </article>
            ))}
        </div>
    );
}
