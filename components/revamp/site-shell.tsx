'use client';
import Link from 'next/link';
import { SoundToggle } from './site-sound';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Github, Linkedin } from 'lucide-react';
const links = [
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/resources', label: 'Resources' },
    { href: '/partnership', label: 'Partnerships' },
];
export function SiteHeader() {
    const path = usePathname();
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
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            aria-current={path === l.href ? 'page' : undefined}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>
                <div className="header-actions">
                    <Link className="officer-link" href="/officer">
                        Officer login <ArrowUpRight size={14} />
                    </Link>
                    <a
                        className="join-button"
                        href="https://discord.gg/tspJCpFFKx"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Join Texas ACM <ArrowUpRight size={16} />
                    </a>
                </div>
            </header>
        </>
    );
}
export function SiteFooter() {
    return (
        <footer className="simple-footer">
            <div className="simple-footer-top">
                <Link href="/" aria-label="Texas ACM home">
                    <img src="/texasacm-logo-white.svg" alt="Texas ACM" width="170" height="39" />
                </Link>
                <nav aria-label="Footer navigation">
                    <Link href="/about">About</Link>
                    <Link href="/events">Events</Link>
                    <Link href="/resources">Resources</Link>
                    <Link href="/partnership">Partnerships</Link>
                    <Link href="/officer">Officer workspace</Link>
                </nav>
            </div>
            <div className="simple-footer-bottom">
                <p>© {new Date().getFullYear()} Texas ACM · UT Austin</p>
                <div>
                    <a
                        href="https://discord.gg/tspJCpFFKx"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Discord
                    </a>
                    <a
                        href="https://www.instagram.com/texas_acm/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Instagram
                    </a>
                    <a href="mailto:pres@texasacm.org">Contact</a>
                    <SoundToggle />
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
