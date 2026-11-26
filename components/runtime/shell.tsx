'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useMemo } from 'react';
import { X, Settings2, Search } from 'lucide-react';
import { useRuntime } from './provider';
import { options, type Settings } from '@/lib/runtime-settings';
import { useSiteDirectory } from './site-directory';
import { directoryAnchor } from '@/lib/site-directory';
export const pages = [
    { title: 'About', href: '/about', group: 'About & partnerships' },
    { title: 'Partnerships', href: '/partnership', group: 'About & partnerships' },
    { title: 'Calendar', href: '/#calendar', group: 'Events' },
    { title: 'Event sign-in', href: '/signin', group: 'Events' },
    { title: 'Resources', href: '/#resources', group: 'Resources' },
    { title: 'CS Guide', href: '/cs-guide', group: 'Resources' },
    { title: 'CS A–Z', href: '/atoz', group: 'Resources' },
    { title: 'FAQ', href: '/faq', group: 'Resources' },
    { title: 'Resume book', href: '/#resume-book', group: 'Resources' },
    { title: 'Forms', href: '/forms', group: 'Resources' },
];
export function RuntimeDock() {
    const r = useRuntime();
    const path = usePathname();
    const { entries: glossary } = useSiteDirectory('glossary');
    const { entries: faq } = useSiteDirectory('faq');
    const { entries: forms } = useSiteDirectory('form');
    const router = useRouter();
    const dialog = useRef<HTMLDialogElement>(null);
    const body = useRef<HTMLDivElement>(null);
    const search = useRef<HTMLInputElement>(null);
    const closeButton = useRef<HTMLButtonElement>(null);
    const panelOpen = r.panel !== null;
    const trigger = useRef<HTMLElement | null>(null);
    const [selected, setSelected] = useState(0);
    const results = useMemo(() => {
        const q = r.query.trim().toLowerCase();
        const rows: { title: string; href: string; group: string; action?: () => void }[] = [
            ...pages,
        ];
        if (r.events.some((e) => /cs\s*week/i.test(e.title)))
            rows.push({ title: 'CS Week', href: '/campaign/cs-week', group: 'Events' });
        if (r.events.some((e) => /election/i.test(e.title)))
            rows.push({
                title: 'Elections',
                href: '/campaign/elections',
                group: 'About & partnerships',
            });
        if (q) {
            for (const [entries, route, group] of [
                [glossary, '/atoz', 'Terms'],
                [faq, '/faq', 'FAQ'],
                [forms, '/forms', 'Forms'],
            ] as const)
                for (const item of entries)
                    rows.push({
                        title: item.title,
                        href: route + '#' + directoryAnchor(item),
                        group,
                    });
            for (const item of r.events)
                rows.push({
                    title: item.title,
                    href: '/#' + encodeURIComponent(item.id),
                    group: 'Events',
                });
            for (const [title, patch] of [
                ['Dark mode', { theme: 'dark' }],
                ['Light mode', { theme: 'light' }],
            ] as [string, Partial<Settings>][])
                rows.push({ title, href: '', group: 'Actions', action: () => r.change(patch) });
        }
        return rows
            .filter(
                (item) =>
                    !q ||
                    item.title.toLowerCase().includes(q) ||
                    item.group.toLowerCase().includes(q),
            )
            .slice(0, 45);
    }, [r.query, r.events, r.change, glossary, faq, forms]);
    useEffect(() => {
        setSelected(0);
    }, [r.query]);
    useEffect(() => {
        r.setPanel(null);
    }, [path]); // Navigation closes the palette.
    useEffect(() => {
        if (!panelOpen) return;
        trigger.current = document.activeElement as HTMLElement;
        const d = dialog.current;
        d?.showModal();
        return () => {
            d?.close();
            if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
        };
    }, [panelOpen]);
    useEffect(() => {
        if (!r.panel) return;
        if (body.current) body.current.scrollTop = 0;
        (r.panel === 'pages' ? search.current : closeButton.current)?.focus({
            preventScroll: true,
        });
    }, [r.panel]);
    async function copyLook() {
        const url = new URL(location.href);
        url.hash = new URLSearchParams({ look: JSON.stringify(r.settings) }).toString();
        try {
            await navigator.clipboard.writeText(url.href);
            r.announce('Link with display settings copied.');
        } catch {
            r.announce('Unable to copy. Check clipboard permission.');
        }
    }
    function activate(index: number) {
        const item = results[index];
        if (!item) return;
        if (item.action) item.action();
        else if (item.href.startsWith('http'))
            window.open(item.href, '_blank', 'noopener,noreferrer');
        else router.push(item.href);
        r.setPanel(null);
    }
    return (
        <>
            <a className="rt-skip" href="#main-content">
                Skip to content
            </a>
            <header className="acm-header">
                <Link className="acm-brand" href="/" aria-label="Texas ACM home">
                    <img src="/texasacm-symbol.svg" width="40" height="32" alt="" />
                    <span>
                        texas <strong>acm</strong>
                        <small>THE UNIVERSITY OF TEXAS AT AUSTIN</small>
                    </span>
                </Link>
                <nav className="acm-primary-nav" aria-label="Main navigation">
                    {[
                        { href: '/about', label: 'Our chapter' },
                        { href: '/#calendar', label: 'Events' },
                        { href: '/#resources', label: 'Resources' },
                        { href: '/partnership', label: 'Partner with us' },
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={path === href ? 'page' : undefined}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="acm-header-tools">
                    <button
                        onClick={() => r.openPanel('pages')}
                        aria-label="Search site"
                        aria-haspopup="dialog"
                        aria-controls="acm-control-panel"
                        aria-expanded={r.panel === 'pages'}
                    >
                        <Search size={19} />
                    </button>
                    <button
                        onClick={() => r.openPanel('display')}
                        aria-label="Open accessibility and display settings"
                        aria-haspopup="dialog"
                        aria-controls="acm-control-panel"
                        aria-expanded={r.panel === 'display'}
                    >
                        <Settings2 size={19} />
                    </button>
                    <a
                        className="acm-header-join"
                        href="https://discord.gg/tspJCpFFKx"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-join
                    >
                        Join ACM <span aria-hidden="true">↗</span>
                    </a>
                </div>
            </header>
            <dialog
                ref={dialog}
                id="acm-control-panel"
                className="rt-palette"
                aria-label={r.panel === 'pages' ? 'Site search' : 'Display settings'}
                data-lenis-prevent
                onCancel={(e) => {
                    e.preventDefault();
                    r.setPanel(null);
                }}
                onClick={(e) => {
                    if (e.target !== e.currentTarget) return;
                    const bounds = e.currentTarget.getBoundingClientRect();
                    if (
                        e.clientX < bounds.left ||
                        e.clientX > bounds.right ||
                        e.clientY < bounds.top ||
                        e.clientY > bounds.bottom
                    )
                        r.setPanel(null);
                }}
            >
                <div className="rt-palette-head">
                    <h2>{r.panel === 'pages' ? 'Search' : 'Display'}</h2>
                    <button
                        className="rt-close"
                        ref={closeButton}
                        aria-label="Close panel"
                        onClick={() => r.setPanel(null)}
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="rt-palette-body" ref={body}>
                    {r.panel === 'pages' ? (
                        <>
                            <div className="rt-search">
                                <Search size={18} />
                                <input
                                    ref={search}
                                    role="combobox"
                                    aria-expanded="true"
                                    aria-autocomplete="list"
                                    aria-controls="rt-command-results"
                                    aria-activedescendant={
                                        results[selected] ? `rt-result-${selected}` : undefined
                                    }
                                    aria-label="Search pages, terms, FAQ, forms and events"
                                    placeholder="Search everything…"
                                    value={r.query}
                                    onChange={(e) => r.setQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowDown') {
                                            e.preventDefault();
                                            setSelected((s) => Math.min(s + 1, results.length - 1));
                                        }
                                        if (e.key === 'ArrowUp') {
                                            e.preventDefault();
                                            setSelected((s) => Math.max(0, s - 1));
                                        }
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            activate(selected);
                                        }
                                    }}
                                />
                            </div>
                            <div
                                className="rt-search-results"
                                id="rt-command-results"
                                role="listbox"
                                aria-label="Search results"
                            >
                                {results.length ? (
                                    results.map((item, i) => (
                                        <div key={item.group + item.title}>
                                            {(i === 0 || results[i - 1].group !== item.group) && (
                                                <div className="rt-label rt-result-group">
                                                    {item.group}
                                                </div>
                                            )}
                                            <button
                                                id={`rt-result-${i}`}
                                                role="option"
                                                aria-selected={i === selected}
                                                className={i === selected ? 'is-selected' : ''}
                                                onPointerMove={() => setSelected(i)}
                                                onClick={() => activate(i)}
                                            >
                                                <span>{item.title}</span>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="rt-empty" role="status">
                                        No matches. Try another search.
                                    </p>
                                )}
                            </div>
                        </>
                    ) : r.panel === 'display' ? (
                        <div className="rt-settings">
                            {(Object.keys(options) as (keyof Settings)[])
                                .filter((key) => key !== 'layout' && key !== 'accent')
                                .map((key) => {
                                    const label = {
                                        text: 'Text size',
                                        motion: 'Motion',
                                        contrast: 'Contrast',
                                        spacing: 'Reading spacing',
                                        links: 'Link styling',
                                        theme: 'Theme',
                                    }[key];
                                    return (
                                        <div
                                            key={key}
                                            className="rt-settings-group"
                                            role="group"
                                            aria-label={label}
                                        >
                                            <span className="rt-settings-label">{label}</span>
                                            <div>
                                                {options[key].map((value) => (
                                                    <button
                                                        key={value}
                                                        aria-pressed={r.settings[key] === value}
                                                        onClick={() => r.change({ [key]: value })}
                                                    >
                                                        {value === 'auto'
                                                            ? 'System'
                                                            : key === 'text'
                                                              ? value + '%'
                                                              : value}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            <button className="rt-share" onClick={copyLook}>
                                Copy link with my settings
                            </button>
                        </div>
                    ) : null}
                </div>
            </dialog>
        </>
    );
}
