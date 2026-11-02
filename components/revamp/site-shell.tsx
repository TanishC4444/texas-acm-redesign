'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X, ChevronDown, Instagram, Github, Linkedin } from 'lucide-react';
const links = [
    { href: '/about', label: 'Our people' },
    { href: '/events', label: 'What’s on' },
    { href: '/resources', label: 'Resources' },
    { href: '/partnership', label: 'Partner with us' },
];
export function SiteHeader() {
    const path = usePathname();
    const [open, setOpen] = useState(false);
    const [resources, setResources] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setOpen(false);
        setResources(false);
    }, [path]);
    useEffect(() => {
        const close = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
                setResources(false);
            }
        };
        const outside = (e: PointerEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setResources(false);
        };
        document.addEventListener('keydown', close);
        document.addEventListener('pointerdown', outside);
        return () => {
            document.removeEventListener('keydown', close);
            document.removeEventListener('pointerdown', outside);
        };
    }, []);
    return (
        <>
            <a className="skip-link" href="#main-content">
                Skip to content
            </a>
            <header className={`studio-header ${path === '/' ? 'universe-header' : ''}`}>
                <Link className="wordmark" href="/" aria-label="Texas ACM home">
                    <img
                        className="chapter-logo logo-light"
                        src="/texasacm-logo-primary.svg"
                        alt="Texas ACM"
                    />
                    <img
                        className="chapter-logo logo-dark"
                        src="/texasacm-logo-white.svg"
                        alt="Texas ACM"
                    />
                </Link>
                <nav className="desktop-nav" aria-label="Main navigation">
                    {links.map((l) =>
                        l.href === '/resources' ? (
                            <div className="resource-disclosure" ref={menuRef} key={l.href}>
                                <button
                                    aria-expanded={resources}
                                    aria-controls="resource-menu"
                                    onClick={() => setResources(!resources)}
                                >
                                    Resources <ChevronDown size={14} />
                                </button>
                                {resources && (
                                    <div id="resource-menu" className="resource-menu">
                                        <Link href="/resources">All resources</Link>
                                        <Link href="/atoz">CS A–Z</Link>
                                        <Link href="/cs-guide">CS Guide</Link>
                                        <Link href="/faq">FAQ</Link>
                                        <Link href="/forms">Forms</Link>
                                        <Link href="/resume-book">Resume book</Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={l.href}
                                href={l.href}
                                aria-current={path === l.href ? 'page' : undefined}
                            >
                                {l.label}
                            </Link>
                        ),
                    )}
                </nav>
                <div className="header-actions">
                    <Link className="officer-link" href="/officer">
                        Officer login <ArrowUpRight size={14} />
                    </Link>
                    <a className="join-button" href="/#join">
                        Join the club <ArrowUpRight size={16} />
                    </a>
                    <button
                        className="mobile-toggle"
                        onClick={() => setOpen(!open)}
                        aria-label={open ? 'Close navigation' : 'Open navigation'}
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                    >
                        {open ? <X /> : <Menu />}
                    </button>
                </div>
                {open && (
                    <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
                        {links.map((l) => (
                            <Link key={l.href} href={l.href}>
                                {l.label}
                                <ArrowUpRight size={18} />
                            </Link>
                        ))}
                        <Link href="/calendar">Calendar</Link>
                        <Link href="/forms">Forms</Link>
                        <a href="/#join">Join Texas ACM</a>
                        <Link href="/officer">Officer login</Link>
                    </nav>
                )}
            </header>
        </>
    );
}
export function SiteFooter() {
    return (
        <footer className="studio-footer">
            <div className="footer-top">
                <div>
                    <span className="eyebrow">YOUR PEOPLE. YOUR NEXT CHAPTER.</span>
                    <h2>
                        Texas ACM.
                        <br />
                        UT Austin.
                        <span className="footer-star">✳</span>
                    </h2>
                    <a
                        className="button button-mint"
                        href="https://discord.gg/tspJCpFFKx"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Meet us on Discord <ArrowUpRight size={18} />
                    </a>
                </div>
                <div className="footer-links">
                    <div>
                        <h3>Find your way</h3>
                        <Link href="/about">Our people</Link>
                        <Link href="/events">Events</Link>
                        <Link href="/calendar">Calendar</Link>
                        <Link href="/partnership">Partnerships</Link>
                        <Link href="/officer">Officer workspace</Link>
                    </div>
                    <div>
                        <h3>A little help</h3>
                        <Link href="/resources">Resources</Link>
                        <Link href="/forms">Forms</Link>
                        <Link href="/faq">FAQ</Link>
                        <Link href="/resume-book">Resume book</Link>
                        <a href="mailto:pres@texasacm.org">Say hello ↗</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <Link href="/" className="wordmark">
                    <img className="chapter-logo" src="/texasacm-logo-white.svg" alt="Texas ACM" />
                </Link>
                <p>Made for the UT Austin CS community. © {new Date().getFullYear()} Texas ACM.</p>
                <div className="social-icons">
                    <a
                        href="https://www.instagram.com/texas_acm/"
                        aria-label="Texas ACM on Instagram"
                    >
                        <Instagram size={19} />
                    </a>
                    <a href="https://github.com/texasacm" aria-label="Texas ACM on GitHub">
                        <Github size={19} />
                    </a>
                    <a
                        href="https://www.linkedin.com/company/utexas-acm/"
                        aria-label="Texas ACM on LinkedIn"
                    >
                        <Linkedin size={19} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
