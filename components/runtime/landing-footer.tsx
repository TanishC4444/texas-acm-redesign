import Link from 'next/link';
import { ArrowUp, Instagram, Linkedin } from 'lucide-react';
import type { DirectoryEntry } from '@/lib/site-directory';

export default function LandingFooter({ contacts }: { contacts: DirectoryEntry[] }) {
    return (
        <footer className="acm-landing-footer" id="contact">
            <div className="acm-footer-invitation">
                <div>
                    <h2>
                        Join Texas ACM
                    </h2>
                </div>
                <a
                    className="acm-footer-join"
                    href="https://discord.gg/tspJCpFFKx"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-join
                >
                    Join Discord
                </a>
            </div>
            <div className="acm-footer-links">
                <Link href="/" className="acm-footer-brand" aria-label="Texas ACM home">
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
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
