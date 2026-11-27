'use client';
import { useEffect, useState } from 'react';
import { useSiteDirectory } from './site-directory';
import { directoryAnchor, safeSiteLink } from '@/lib/site-directory';
import { PageIntro } from './primitives';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export default function Glossary() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [letter, setLetter] = useState('All');
    const { entries } = useSiteDirectory('glossary');
    const terms = entries
        .map((entry) => ({ ...entry, term: entry.title }))
        .sort((a, b) => a.term.localeCompare(b.term));
    const categories = [...new Set(entries.map((entry) => entry.category).filter(Boolean))];
    useEffect(() => {
        const slug = decodeURIComponent(location.hash.slice(1));
        if (!slug || slug.startsWith('look=')) return;
        setTimeout(() => document.getElementById(slug)?.scrollIntoView(), 100);
    }, []);
    const filtered = terms.filter(
        (t) =>
            (category === 'All' || category === t.category) &&
            (letter === 'All' || t.term.toUpperCase().startsWith(letter)) &&
            `${t.term} ${t.description} ${t.category}`.toLowerCase().includes(query.toLowerCase()),
    );
    return (
        <div className="rt-page">
            <PageIntro
                label="CS A–Z"
                title="Find the term."
                description="Tools, courses and campus life, explained."
            />
            <section className="rt-cell rt-glossary-tools">
                <label className="rt-label" htmlFor="term-search">
                    Search terms
                </label>
                <input
                    id="term-search"
                    data-page-search
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search terms, descriptions or categories…"
                />
                <label className="rt-label">
                    Category
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option>All</option>
                        {categories.map((name) => (
                            <option key={name}>{name}</option>
                        ))}
                    </select>
                </label>
                <nav className="rt-alphabet" aria-label="Filter by first letter">
                    {['All', ...alphabet].map((l) => (
                        <button key={l} aria-pressed={letter === l} onClick={() => setLetter(l)}>
                            {l}
                        </button>
                    ))}
                </nav>
                <p className="rt-mono" role="status">
                    {filtered.length} results
                </p>
            </section>
            <div className="rt-term-list">
                {filtered.map((t) => (
                    <article className="rt-term-row rt-cell" key={t.id} id={directoryAnchor(t)}>
                        <div>
                            <a href={'#' + directoryAnchor(t)}>
                                <h2>{t.term}</h2>
                            </a>
                            <span className="rt-label">{t.category}</span>
                        </div>
                        <div>
                            <p>{t.description}</p>
                            {safeSiteLink(t.url) && (
                                <a
                                    className="rt-text-link"
                                    href={t.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open resource
                                </a>
                            )}
                        </div>
                    </article>
                ))}
                {!filtered.length && (
                    <p className="rt-empty">No matches. Try another term or clear your filters.</p>
                )}
            </div>
        </div>
    );
}
