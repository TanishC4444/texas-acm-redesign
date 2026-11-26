'use client';

import { usePublishedContent } from '@/components/revamp/live-content';
import { publicUrl } from '@/lib/runtime-calendar';

export default function ChapterContent({ kind }: { kind: 'announcement' | 'resource' }) {
    const { items } = usePublishedContent(kind);
    if (!items.length) return null;

    return (
        <section
            className={`acm-published-content acm-published-${kind}`}
            aria-label={
                kind === 'announcement' ? 'Chapter announcements' : 'More student resources'
            }
        >
            {kind === 'announcement' && <h2>Chapter announcements</h2>}
            {items.map((item) => {
                const url = publicUrl(item.url);
                const image = publicUrl(item.image);
                return (
                    <article key={item.id}>
                        {image && (
                            <img src={image} alt="" loading="lazy" referrerPolicy="no-referrer" />
                        )}
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        {url && (
                            <a
                                className="rt-text-link"
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {kind === 'announcement' ? 'Read more' : 'Open resource'}
                            </a>
                        )}
                    </article>
                );
            })}
        </section>
    );
}
