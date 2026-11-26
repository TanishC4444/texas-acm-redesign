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
            <Companies />
            <section className="acm-chapter" id="chapter" aria-labelledby="chapter-heading">
                <div className="acm-chapter-heading">
                    <p className="acm-eyebrow">A CAMPUS THIS BIG. A COMMUNITY THAT’S YOURS.</p>
                    <h2 id="chapter-heading">
                        Better <em>together.</em>
                    </h2>
                    <p>
                        Find a new interest. Meet your next collaborator. Or just find someone to
                        grab dinner with after class.
                    </p>
                    <Link className="acm-inline-link" href="/about">
                        Meet the chapter <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                </div>
                <div className="acm-chapter-image">
                    <ManagedPhoto
                        slot="gallery-0"
                        src="/studio/acmretreat25.webp"
                        alt="Texas ACM students spending time together at the chapter retreat"
                        width="1000"
                        height="700"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            </section>
            <section
                className="acm-involvement"
                id="find-your-place"
                aria-labelledby="involvement-heading"
            >
                <header className="acm-section-heading">
                    <div>
                        <p className="acm-eyebrow">COME CURIOUS. LEAVE CONNECTED.</p>
                        <h2 id="involvement-heading">Find your place.</h2>
                    </div>
                    <Link className="acm-inline-link" href="/#calendar">
                        Explore our events <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                </header>
                <div className="acm-involvement-photos">
                    {[
                        [
                            '01',
                            'Industry',
                            'Meet the people building it.',
                            'Company talks, technical workshops, and conversations that open doors.',
                            'acmformal25.webp',
                            'Texas ACM members at the chapter formal',
                            'industry',
                            '/partnership',
                        ],
                        [
                            '02',
                            'Academics',
                            'Go beyond the lecture.',
                            'Learn together, talk with professors, and find a different way into computing.',
                            'pwp.webp',
                            'Texas ACM students meeting professors',
                            'academics',
                            '/cs-guide',
                        ],
                        [
                            '03',
                            'Community',
                            'Find your kind of people.',
                            'Game nights, retreats, and the familiar faces that make campus feel smaller.',
                            'family-feud.webp',
                            'Students at Texas ACM Family Feud',
                            'community',
                            '/about',
                        ],
                    ].map(([number, title, text, description, photo, alt, id, href]) => (
                        <Link href={href} className="acm-program-card" id={id} key={id}>
                            <div className="acm-program-image">
                                <ManagedPhoto
                                    slot={id}
                                    src={'/studio/' + photo}
                                    alt={alt}
                                    width="800"
                                    height="600"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <span>
                                    {number} / {title.toUpperCase()}
                                </span>
                            </div>
                            <div className="acm-program-copy">
                                <h3>{text}</h3>
                                <p>{description}</p>
                                <span className="acm-program-link">
                                    {title} <ArrowUpRight size={18} aria-hidden="true" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            <ChapterContent kind="announcement" />
            <CalendarHub />
            <section className="acm-resource-band" id="resources">
                <header className="acm-resources-heading">
                    <div>
                        <p className="acm-eyebrow">A LITTLE HELP GOES A LONG WAY.</p>
                        <h2>For what’s next.</h2>
                    </div>
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
                {publicContacts.length > 0 && (
                    <section
                        className="acm-contact-links"
                        id="contact"
                        aria-label="Contact Texas ACM"
                    >
                        <h3>Contact Texas ACM</h3>
                        <div>
                            {publicContacts.map((item) => (
                                <a key={item.id} href={item.url} className="rt-button">
                                    {item.title}
                                </a>
                            ))}
                        </div>
                    </section>
                )}
            </section>
            <InstagramFeed embedded />
        </div>
    );
}
