'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Plus, X, ArrowRight, Pause, Play } from 'lucide-react';
import VisualControls from './visual-controls';
const links = [
    { href: '/', label: 'Home', note: 'Start Here' },
    { href: '/about', label: 'About', note: 'Meet the Chapter' },
    { href: '/events', label: 'Events', note: 'Find Your People' },
    { href: '/calendar', label: 'Calendar', note: 'Make Some Plans' },
    { href: '/resources', label: 'Resources', note: 'Get a Head Start' },
    { href: '/partnership', label: 'Partnerships', note: '' },
];
export function SiteHeader() {
    const path = usePathname();
    const [open, setOpen] = useState(false);
    const [motionPaused, setMotionPaused] = useState(false);
    function toggleMotion() {
        const next = !motionPaused;
        setMotionPaused(next);
        document.documentElement.dataset.motion = next ? 'paused' : 'playing';
    }
    const root = useRef<HTMLElement>(null);
    const toggle = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        setOpen(false);
    }, [path]);
    useEffect(() => {
        if (!open) return;
        root.current
            ?.querySelector<HTMLAnchorElement>('.index-links a')
            ?.focus({ preventScroll: true });
        function close(e: PointerEvent) {
            if (!root.current?.contains(e.target as Node)) setOpen(false);
        }
        function escape(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setOpen(false);
                toggle.current?.focus();
            }
        }
        document.addEventListener('pointerdown', close);
        document.addEventListener('keydown', escape);
        return () => {
            document.removeEventListener('pointerdown', close);
            document.removeEventListener('keydown', escape);
        };
    }, [open]);
    return (
        <>
            <a className="skip-link" href="#main-content">
                Skip to Content
            </a>
            <nav className="chapter-dock" ref={root} aria-label="Chapter navigation">
                {open && (
                    <div className="chapter-index" id="chapter-index">
                        <div className="index-heading">
                            <span>Pages</span>
                        </div>
                        <div className="index-links">
                            {links.map((l) => (
                                <Link
                                    href={l.href}
                                    key={l.href}
                                    aria-current={path === l.href ? 'page' : undefined}
                                    onClick={() => setOpen(false)}
                                >
                                    <strong>{l.label}</strong>

                                    <ArrowUpRight size={23} />
                                </Link>
                            ))}
                        </div>
                        <a
                            className="index-join"
                            href="https://discord.gg/tspJCpFFKx"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Join the Chapter Discord. <ArrowRight size={19} />
                        </a>
                    </div>
                )}
                <div className="dock-bar">
                    <Link href="/" className="dock-brand" aria-label="Texas ACM home">
                        <img className="dock-logo" src="/texasacm-symbol.svg" alt="Texas ACM" />
                    </Link>
                    <button
                        ref={toggle}
                        className="index-toggle"
                        aria-expanded={open}
                        aria-controls="chapter-index"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? 'Close' : 'Pages'}
                        {open ? <X size={18} /> : <Plus size={18} />}
                    </button>
                    <span className="dock-divider" />
                    <Link className="dock-officer" href="/officer">
                        Officer Login <ArrowUpRight size={14} />
                    </Link>
                    <button
                        className="dock-motion"
                        onClick={toggleMotion}
                        aria-pressed={motionPaused}
                        aria-label={motionPaused ? 'Resume animations' : 'Pause animations'}
                    >
                        {motionPaused ? <Play size={15} /> : <Pause size={15} />}
                    </button>
                    <VisualControls />
                </div>
            </nav>
        </>
    );
}
export function SiteFooter() {
    return (
        <footer className="simple-footer">
            <div className="simple-footer-top">
                <Link className="footer-brand" href="/" aria-label="Texas ACM home">
                    <img className="footer-logo" src="/texasacm-logo-brand.svg" alt="Texas ACM" />
                </Link>
                <p>
                    The Association for Computing Machinery
                    <br />
                    at The University of Texas at Austin.
                </p>
                <nav aria-label="Footer navigation">
                    {links.slice(1).map((l) => (
                        <Link key={l.href} href={l.href}>
                            {l.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="simple-footer-bottom">
                <p>© {new Date().getFullYear()} Texas ACM · UT Austin</p>
                <div>
                    <a
                        href="https://www.instagram.com/texas_acm/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Instagram <ArrowUpRight size={14} />
                    </a>
                    <a
                        href="https://discord.gg/tspJCpFFKx"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Discord <ArrowUpRight size={14} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
