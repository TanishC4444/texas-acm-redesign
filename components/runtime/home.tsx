'use client';
import Link from 'next/link';
import RuntimeHero from './hero';
import ManagedPhoto from '@/components/revamp/site-photos';
import {
    BookOpen,
    ArrowUpRight,
    ClipboardList,
    FileText,
    Instagram,
    Linkedin,
    List,
    CircleHelp,
} from 'lucide-react';
import Companies from './companies';
import CalendarHub from './calendar-hub';
import ChapterContent from './chapter-content';
import InstagramFeed from '@/components/revamp/instagram-feed';
import { useSiteDirectory } from './site-directory';
import { safeSiteLink } from '@/lib/site-directory';
import LandingFooter from './landing-footer';
import ChapterSeparator from './chapter-separator';

const resourceIcons = {
    guide: BookOpen,
    atoz: List,
    forms: ClipboardList,
    'resume-book': FileText,
    faq: CircleHelp,
};
export default function RuntimeHome() {
    const { entries: links } = useSiteDirectory('link');
    const { entries: contacts } = useSiteDirectory('contact');
    const publicContacts = contacts.filter((entry) => safeSiteLink(entry.url, true));
    return (
        <div className="rt-page acm-home">
            <RuntimeHero />
            <div className="acm-art-ribbon" aria-hidden="true">
                <span>COME FOR THE CODE.</span>
                <svg viewBox="0 0 40 40" fill="none">
                    <path
                        d="M20 2v36M2 20h36M7 7l26 26M7 33L33 7"
                        stroke="currentColor"
                        strokeWidth="5"
                    />
                </svg>
                <em>Stay for the people.</em>
                <span className="acm-ribbon-end">AT UT, TOGETHER.</span>
            </div>
            <Companies />
            <section className="acm-chapter" id="chapter">
                <figure className="acm-chapter-postcard">
                    <ManagedPhoto
                        slot="gallery-0"
                        src="/studio/acmretreat25.webp"
                        alt="Texas ACM students at the chapter retreat"
                        width="1000"
                        height="700"
                        loading="lazy"
                    />
                    <figcaption>
                        Out of the group chat. Into the good stuff.{' '}
                        <span aria-hidden="true">↗</span>
                    </figcaption>
                </figure>
                <div>
                    <h2>
                        Better <em>together.</em>
                    </h2>
                    <p>
                        Technical workshops, company talks, game nights, and a community beyond
                        class. Open to every major.
                    </p>
                    <Link className="rt-text-link" href="/about">
                        Meet the chapter
                    </Link>
                </div>
                <figure className="acm-instagram" id="updates">
                    <ManagedPhoto
                        slot="gallery-3"
                        src="/studio/acmhand25.webp"
                        alt="Texas ACM chapter members together"
                        width="1000"
                        height="600"
                        loading="lazy"
                    />
                    <figcaption>
                        <a
                            href="https://www.instagram.com/texas_acm/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @texas_acm
                        </a>
                    </figcaption>
                </figure>
            </section>
            <ChapterSeparator variant="orbit" />
            <section
                className="acm-involvement"
                id="find-your-place"
                aria-labelledby="involvement-heading"
            >
                <div className="acm-art-section-heading">
                    <span className="acm-poster-eyebrow">THREE WAYS IN. NO WRONG DOOR.</span>
                    <h2 id="involvement-heading">
                        Find your <em>thing.</em>
                    </h2>
                    <span className="acm-art-asterisk" aria-hidden="true">
                        ✳
                    </span>
                </div>
                <div className="acm-involvement-photos">
                    {[
                        [
                            'Industry',
                            'Meet the people building it.',
                            'acmformal25.webp',
                            'Texas ACM members at the chapter formal',
                            'industry',
                        ],
                        [
                            'Academics',
                            'Learn beyond the lecture.',
                            'pwp.webp',
                            'Texas ACM students meeting professors',
                            'academics',
                        ],
                        [
                            'Community',
                            'Find your people.',
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
            <ChapterSeparator variant="path" />
            <CalendarHub />
            <section className="acm-resource-band" id="resources">
                <header className="acm-resources-heading">
                    <h2>
                        A little <em>head start.</em>
                    </h2>
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
                        .map(({ id, url, title, description }) => {
                            const Icon =
                                resourceIcons[id as keyof typeof resourceIcons] ?? FileText;
                            const external = url.startsWith('https://');
                            return (
                                <Link
                                    key={id}
                                    href={url}
                                    id={id === 'resume-book' ? id : undefined}
                                    target={external ? '_blank' : undefined}
                                    rel={external ? 'noopener noreferrer' : undefined}
                                >
                                    <Icon size={22} aria-hidden="true" />
                                    <strong>{title}</strong>
                                    <span>{description}</span>
                                    <ArrowUpRight
                                        className="acm-resource-arrow"
                                        size={18}
                                        aria-hidden="true"
                                    />
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
