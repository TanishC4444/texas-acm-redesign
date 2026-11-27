'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ChapterReveal, { INTRO_DURATION } from './logo-reveal';
import { SoundToggle } from './site-sound';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import ManagedPhoto from './site-photos';
import InstagramFeed from './instagram-feed';
import { PublishedCards } from './live-content';
import CalendarBoard from './calendar-board';
import ChapterGallery from './chapter-gallery';
const pillars = [
    {
        label: 'Academics',
        title: 'Learn Together',
        text: 'Explore new ideas through technical workshops, faculty conversations, and academic support.',
        photo: '/studio/pwp.webp',
        alt: 'Texas ACM members connecting with professors',
        href: '/events#academics',
        note: 'Professors, Pancakes & Questions.',
    },
    {
        label: 'Industry',
        title: 'Meet the Industry',
        text: 'Connect with people shaping technology through company talks, professional workshops, and our Corporate Banquet.',
        photo: '/studio/acmformal25.webp',
        alt: 'Texas ACM members at the chapter formal',
        href: '/events#industry',
        note: 'The Chapter, Dressed Up.',
    },
    {
        label: 'Community',
        title: 'Find Your People',
        text: 'Make space for friendships, retreats, game nights, and a community beyond your classes.',
        photo: '/studio/family-feud.webp',
        alt: 'Students at Texas ACM Family Feud',
        href: '/events#community',
        note: 'After Class, With ACM.',
    },
];
export default function MachineHome() {
    const [active, setActive] = useState(0);
    const [intro, setIntro] = useState(false);
    const [paused, setPaused] = useState(false);
    useEffect(() => {
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setIntro(true);
    }, []);
    useEffect(() => {
        if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const timer = setInterval(() => {
            if (!document.hidden && document.documentElement.dataset.motion !== 'paused')
                setActive((value) => (value + 1) % pillars.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [paused]);
    useEffect(() => {
        if (!intro) return;
        const timer = setTimeout(() => setIntro(false), INTRO_DURATION);
        return () => clearTimeout(timer);
    }, [intro]);
    return (
        <div className={`editorial-home ${paused ? 'motion-paused' : ''}`}>
            {intro && <ChapterReveal onSkip={() => setIntro(false)} />}
            <section className="chapter-opening" aria-labelledby="opening-title">
                <div className="chapter-masthead">
                    <h1 id="opening-title">
                        <img
                            className="original-brand-lockup"
                            src="/texasacm-logo-brand.svg"
                            alt="Texas ACM"
                            width="1316"
                            height="262"
                        />
                    </h1>
                </div>
                <div className="opening-composition">
                    <div className="opening-art" aria-label="Explore our three chapter pillars">
                        <svg
                            className="chapter-orbit-grid"
                            viewBox="0 0 600 440"
                            aria-hidden="true"
                        >
                            <g fill="none" stroke="currentColor" strokeWidth=".8">
                                <ellipse cx="300" cy="220" rx="285" ry="185" />
                                <ellipse cx="300" cy="220" rx="285" ry="80" />
                                <ellipse cx="300" cy="220" rx="110" ry="185" />
                                <path d="M15 220h570M300 35v370M80 90l440 260M80 350L520 90" />
                            </g>
                            <circle
                                className="orbit-tracer"
                                cx="300"
                                cy="35"
                                r="5"
                                fill="currentColor"
                            />
                        </svg>
                        <div className="poster-back" aria-hidden="true" />
                        <figure className="poster-photo" key={active}>
                            <ManagedPhoto
                                slot={active === 1 ? 'home' : `opening-${active}`}
                                src={pillars[active].photo}
                                alt={pillars[active].alt}
                                fetchPriority="high"
                                width={800}
                                height={600}
                            />
                            <figcaption>
                                <span>
                                    0{active + 1} / {pillars[active].label}
                                </span>
                            </figcaption>
                        </figure>
                        <div className="art-stamp">
                            <span className="stamp-mark" aria-hidden="true">
                                ◇
                            </span>
                            <span>
                                All Majors.
                                <br />
                                All Welcome.
                            </span>
                        </div>
                    </div>
                    <div className="opening-copy">
                        <h2>
                            Your Friends
                            <br />
                            in Computer
                            <br />
                            <span>Science.</span>
                        </h2>

                        <div className="opening-actions">
                            <a
                                className="editorial-button"
                                href="https://discord.gg/tspJCpFFKx"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Join the Discord <ArrowUpRight size={18} />
                            </a>
                            <a href="#about">
                                About the Chapter <ArrowRight size={18} />
                            </a>
                        </div>
                        <div
                            className="pillar-switcher"
                            role="group"
                            aria-label="Explore the chapter"
                        >
                            <div>
                                {pillars.map((p, i) => (
                                    <button
                                        key={p.label}
                                        aria-pressed={active === i}
                                        onClick={() => setActive(i)}
                                    >
                                        {p.label}
                                        <ArrowUpRight size={13} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opening-baseline">
                    <nav aria-label="Quick navigation">
                        <Link href="/about">About</Link>
                        <Link href="/events">Events</Link>
                        <Link href="/calendar">Calendar</Link>
                        <Link href="/resources">Resources</Link>
                        <Link href="/partnership">Partnerships</Link>
                    </nav>
                    <div className="animation-controls">
                        <button onClick={() => setIntro(true)}>Play Logo Animation</button>
                        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
                            {paused ? 'Resume Motion' : 'Pause Motion'}
                        </button>
                        <SoundToggle />
                    </div>
                </div>
            </section>
            <section
                id="about"
                className="chapter-about editorial-section"
                aria-labelledby="about-title"
            >
                <div className="chapter-about-grid">
                    <h2 id="about-title">
                        About
                        <br />
                        <em>Texas ACM.</em>
                    </h2>
                    <div>
                        <p>
                            We’re Texas ACM, the UT Austin student chapter of the Association for
                            Computing Machinery. We bring students together through academics,
                            industry, and community.
                        </p>
                        <p>
                            Our members organize workshops, meet with faculty, connect with
                            employers, and make time for each other outside class. All majors are
                            welcome.
                        </p>
                        <Link className="editorial-text-link" href="/about">
                            Meet Texas ACM <ArrowUpRight size={19} />
                        </Link>
                    </div>
                </div>
                <ChapterGallery still={paused} />
            </section>
            <section className="editorial-section chapter-places" aria-labelledby="places-title">
                <div className="editorial-section-title">
                    <h2 id="places-title">
                        Find Your <em>Place.</em>
                    </h2>
                    <Link href="/events" className="editorial-text-link">
                        Explore Events <ArrowUpRight size={18} />
                    </Link>
                </div>
                <div className="place-grid">
                    {pillars.map((p, i) => (
                        <Link className={`place-card place-${i}`} href={p.href} key={p.label}>
                            <div className="place-card-label">
                                <span>
                                    0{i + 1} / {p.label}
                                </span>
                                <ArrowUpRight size={22} />
                            </div>
                            <div className="place-photo">
                                <img
                                    src={p.photo}
                                    alt={p.alt}
                                    width={800}
                                    height={600}
                                    loading="lazy"
                                />
                            </div>
                            <h3>{p.title}</h3>
                            <p>{p.text}</p>
                            <span className="place-discover">
                                Discover More <ArrowRight size={17} />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
            <section
                className="editorial-section chapter-calendar-section"
                aria-labelledby="calendar-title"
            >
                <div className="editorial-section-title">
                    <h2 id="calendar-title">
                        The Chapter
                        <br />
                        <em>Calendar.</em>
                    </h2>
                    <p>
                        Workshops, conversations, and time with your people.
                        <br />
                        Check the schedule and join us.
                    </p>
                </div>
                <PublishedCards kind="event" limit={3} hideEmpty />
                <CalendarBoard />
                <Link href="/events" className="editorial-text-link calendar-more">
                    Explore Chapter Events <ArrowUpRight size={18} />
                </Link>
            </section>
            <section
                className="editorial-section chapter-resources"
                aria-labelledby="resources-title"
            >
                <div className="resource-intro">
                    <h2 id="resources-title">
                        Student
                        <br />
                        <em>Resources.</em>
                    </h2>
                    <p>
                        Navigate UTCS with resources from the people who know it. Your next step is
                        right here.
                    </p>
                </div>
                <div className="resource-link-grid">
                    {[
                        ['CS Guide', 'Classes, campus, and getting started.', '/resources#guide'],
                        ['CS A–Z', 'The terms and tools worth knowing.', '/resources#atoz'],
                        [
                            'Resume Book',
                            'Share your resume with our partners.',
                            '/resources#resume',
                        ],
                        [
                            'Forms & FAQs',
                            'The practical things, all in one place.',
                            '/resources#forms',
                        ],
                    ].map(([title, text, href], i) => (
                        <Link href={href} key={title}>
                            <span>0{i + 1}</span>
                            <div>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </div>
                            <ArrowUpRight size={24} />
                        </Link>
                    ))}
                </div>
            </section>
            <InstagramFeed compact />
        </div>
    );
}
