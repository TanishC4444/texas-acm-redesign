'use client';
import { useState } from 'react';
import { usePublishedContent } from '@/components/revamp/live-content';
import { useRuntime } from './provider';
import { useSiteDirectory } from './site-directory';
import { directoryAnchor, safeSiteLink } from '@/lib/site-directory';
import { PageIntro } from './primitives';
import { deadlineStatus } from '@/lib/runtime-forms';
export default function FormsPage() {
    const { now } = useRuntime();
    const { items } = usePublishedContent('form');
    const [archive, setArchive] = useState(false);
    const [query, setQuery] = useState('');
    const { entries } = useSiteDirectory('form');
    const forms = [
        ...entries.map((f) => ({
            id: directoryAnchor(f),
            title: f.title,
            description: f.description,
            url: f.url,
            deadline: f.category || undefined,
        })),
        ...items.map((f) => ({
            id: f.id,
            title: f.title,
            description: f.description,
            url: f.url,
            deadline: f.date || undefined,
        })),
    ];
    const visible = forms.filter(
        (f) =>
            (archive || deadlineStatus(f.deadline, now) !== 'Closed') &&
            `${f.title} ${f.description}`.toLowerCase().includes(query.toLowerCase()),
    );
    return (
        <div className="rt-page">
            <PageIntro
                label="Forms"
                title="Take the next step."
                description="Chapter forms and opportunities, with current deadlines."
            />
            <div className="rt-form-controls rt-cell">
                <label htmlFor="form-search">Find a form</label>
                <input
                    id="form-search"
                    data-page-search
                    placeholder="Search forms…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    className="rt-button"
                    aria-pressed={archive}
                    onClick={() => setArchive(!archive)}
                >
                    {archive ? 'Hide' : 'Show'} archived forms
                </button>
            </div>
            <div>
                {visible.map((f) => {
                    const status = deadlineStatus(f.deadline, now);
                    return (
                        <article className="rt-form-row rt-cell" key={f.id} id={f.id}>
                            <div>
                                <h2>{f.title}</h2>
                                <p>{f.description}</p>
                            </div>
                            <div className="rt-form-meta">
                                <span
                                    className={`rt-chip ${status === 'Closes soon' ? 'rt-signal-text' : ''}`}
                                >
                                    {status}
                                </span>
                                {f.deadline && (
                                    <time className="rt-mono" dateTime={f.deadline}>
                                        {new Date(f.deadline).toLocaleString('en-US', {
                                            timeZone: 'America/Chicago',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        })}{' '}
                                        CT
                                    </time>
                                )}
                            </div>
                            {status === 'Closed' ? (
                                <span className="rt-label">Archived</span>
                            ) : safeSiteLink(f.url) ? (
                                <a
                                    className="rt-text-link"
                                    href={f.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open form
                                </a>
                            ) : null}
                        </article>
                    );
                })}
                {!visible.length && (
                    <p className="rt-empty">No matching forms. Check back for new opportunities.</p>
                )}
            </div>
        </div>
    );
}
