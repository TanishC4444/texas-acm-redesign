'use client';
import Link from 'next/link';
import RuntimeHero from './hero';
import ManagedPhoto from '@/components/revamp/site-photos';
import {
    Instagram,
    Linkedin,
} from 'lucide-react';
import CalendarHub from './calendar-hub';
import ChapterContent from './chapter-content';
import InstagramFeed from '@/components/revamp/instagram-feed';
import { useSiteDirectory } from './site-directory';
import { safeSiteLink } from '@/lib/site-directory';
import LandingFooter from './landing-footer';

export default function RuntimeHome() {
    const { entries: links } = useSiteDirectory('link');
    const { entries: contacts } = useSiteDirectory('contact');
    const publicContacts = contacts.filter((entry) => safeSiteLink(entry.url, true));
    return (
        <div className="rt-page acm-home">
            <RuntimeHero />
            <section
                className="acm-involvement"
                id="find-your-place"
                aria-labelledby="involvement-heading"
            >
                <header className="acm-home-section-heading" id="chapter">
                    <h2 id="involvement-heading">What we do</h2>
                    <Link className="rt-text-link" href="/about">About the chapter</Link>
                </header>
                <div className="acm-involvement-photos">
                    {[
                        [
                            'Industry',
                            'Company talks and career events.',
                            'acmformal25.webp',
                            'Texas ACM members at the chapter formal',
                            'industry',
                        ],
                        [
                            'Academics',
                            'Workshops and study resources.',
                            'pwp.webp',
                            'Texas ACM students meeting professors',
                            'academics',
                        ],
                        [
                            'Community',
                            'Socials and chapter events.',
                            'family-feud.webp',
                            'Students at Texas ACM Family Feud',
                            'community',
                        ],
                    ].map(([title, text, photo, alt, id]) => (
                        <article id={id} key={id}>
                            <ManagedPhoto
                                slot={id}
                                src={'/studio/' + photo}
                                alt={alt}
                                width="800"
                                height="600"
                                loading="lazy"
                            />
                            <div>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            <ChapterContent kind="announcement" />
            <CalendarHub />
            <section className="acm-resource-band" id="resources">
                <header className="acm-resources-heading">
                    <h2>Student resources</h2>
                    <nav className="acm-social-icons" aria-label="Texas ACM social media">
                        <a
                            href="https://www.instagram.com/texas_acm/"
                            aria-label="Instagram"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Instagram aria-hidden="true" size={23} />
                        </a>
                        <a
                            href="https://discord.gg/tspJCpFFKx"
                            aria-label="Discord"
                            data-join
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M19.7 5.4a18 18 0 0 0-4.4-1.4l-.5 1a16 16 0 0 0-5.6 0l-.5-1a18 18 0 0 0-4.4 1.4C1.5 9.5.7 13.4 1.1 17.2a18 18 0 0 0 5.4 2.8l1.2-1.9-1.8-.9.4-.3a14.7 14.7 0 0 0 11.4 0l.4.3-1.8.9 1.2 1.9a18 18 0 0 0 5.4-2.8c.5-4.4-.8-8.3-3.2-11.8ZM8.4 15.2c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2c0 1.1-.8 2-1.8 2Zm7.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.linkedin.com/company/utexas-acm/"
                            aria-label="LinkedIn"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Linkedin aria-hidden="true" size={23} />
                        </a>
                    </nav>
                </header>
                <nav className="acm-resource-links" aria-label="Student resources">
                    {links
                        .filter((entry) => safeSiteLink(entry.url))
                        .map(({ id, url, title }) => {
                            const external = url.startsWith('https://');
                            return (
                                <Link
                                    key={id}
                                    href={url}
                                    id={id === 'resume-book' ? id : undefined}
                                    target={external ? '_blank' : undefined}
                                    rel={external ? 'noopener noreferrer' : undefined}
                                >
                                    <strong>{title}</strong>
                                </Link>
                            );
                        })}
                </nav>
                <ChapterContent kind="resource" />
            </section>
            <InstagramFeed embedded />
            <LandingFooter contacts={publicContacts} />
        </div>
    );
}
