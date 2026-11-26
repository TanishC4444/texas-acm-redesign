'use client';

import { PageIntro } from './primitives';
import { useSiteDirectory } from './site-directory';
import { directoryAnchor } from '@/lib/site-directory';
export default function FAQ() {
    const { entries } = useSiteDirectory('faq');
    return (
        <div className="rt-page">
            <PageIntro label="FAQ" title="Get a direct answer." />
            <div className="rt-split">
                <nav className="rt-cell rt-sticky rt-faq-nav" aria-label="Questions">
                    {entries.map((item) => (
                        <a key={item.id} href={'#' + directoryAnchor(item)}>
                            {item.title}
                        </a>
                    ))}
                </nav>
                <div className="rt-stack">
                    {entries.map((item) => (
                        <article
                            className="rt-cell"
                            id={directoryAnchor(item)}
                            key={item.id}
                            data-section-title={item.title}
                        >
                            <h2>{item.title}</h2>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
