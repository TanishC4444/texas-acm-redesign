import Link from 'next/link';
import { ArrowUp, ArrowUpRight, Instagram, Linkedin } from 'lucide-react';
import type { DirectoryEntry } from '@/lib/site-directory';

export default function LandingFooter({ contacts }: { contacts: DirectoryEntry[] }) {
    return (
        <footer className="acm-landing-footer" id="contact">
            <svg className="acm-footer-shape" viewBox="0 0 200 200" fill="none" aria-hidden="true">
                <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="18" />
                <rect
                    x="42"
                    y="42"
                    width="116"
                    height="116"
                    rx="24"
                    transform="rotate(45 100 100)"
                    stroke="currentColor"
                    strokeWidth="3"
                />
            </svg>
            <div className="acm-footer-invitation">
                <div>
                    <span className="acm-footer-label">YOUR PEOPLE ARE HERE.</span>
                    <h2>
                        See you <em>around.</em>
                    </h2>
                </div>
                <a
                    className="acm-footer-join"
                    href="https://discord.gg/tspJCpFFKx"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-join
                >
                    Join the chapter <ArrowUpRight size={22} aria-hidden="true" />
                </a>
            </div>
            <div className="acm-footer-links">
                <Link href="/" className="acm-footer-brand" aria-label="Texas ACM home">
                    <img src="/texasacm-symbol.svg" width="38" height="30" alt="" />
                    <strong>texas acm</strong>
                </Link>
                <nav aria-label="Chapter links">
                    <Link href="/about">About</Link>
                    <Link href="/#calendar">Calendar</Link>
                    <Link href="/#resources">Resources</Link>
                    <Link href="/partnership">Partner with us</Link>
                </nav>
                <div className="acm-footer-socials">
                    <a
                        href="https://www.instagram.com/texas_acm/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Texas ACM on Instagram"
                    >
                        <Instagram size={19} />
                    </a>
                    <a
                        href="https://www.linkedin.com/company/utexas-acm/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Texas ACM on LinkedIn"
                    >
                        <Linkedin size={19} />
                    </a>
                    <a href="#main-content" aria-label="Back to top">
                        <ArrowUp size={19} />
                    </a>
                </div>
            </div>
            <div className="acm-footer-fineprint">
                <span>Texas ACM · UT Austin</span>
                <nav aria-label="Contact the chapter">
                    {contacts.map((contact) => (
                        <a key={contact.id} href={contact.url}>
                            {contact.title}
                            <ArrowUpRight size={12} aria-hidden="true" />
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
