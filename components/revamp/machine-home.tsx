'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import { ArrowUpRight, RotateCcw, Pause, Play } from 'lucide-react';
import ChapterReveal from './logo-reveal';
import ChapterGallery from './chapter-gallery';
import InstagramFeed from './instagram-feed';
import EmailSignupForm from '@/components/EmailSignupForm';
import { PublishedCards } from './live-content';
let played = false;
const activities = [
    {
        name: 'Academics',
        title: 'Workshops & professors.',
        description: 'Technical workshops, guest speakers, and Pancakes with Professors.',
        src: 'pwp',
        href: '/events#academics',
        alt: 'Texas ACM Pancakes with Professors gathering',
    },
    {
        name: 'Industry',
        title: 'Tech talks & careers.',
        description:
            'Company tech talks, career workshops, and connections with our corporate partners.',
        src: 'acmformal25',
        href: '/events#industry',
        alt: 'Texas ACM student community at formal',
    },
    {
        name: 'Community',
        title: 'Texas ACM, outside class.',
        description: 'Game nights, retreats, mentorship, and CS Week.',
        src: 'familyfeud25',
        href: '/events#community',
        alt: 'Texas ACM Family Feud community event',
    },
];
export default function MachineHome() {
    const reduced = useReducedMotion();
    const [intro, setIntro] = useState(false);
    const [paused, setPaused] = useState(false);
    const [activeProgram, setActiveProgram] = useState('academics');
    const page = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting)
                        setActiveProgram((entry.target as HTMLElement).dataset.acmProgram!);
                });
            },
            { rootMargin: '-15% 0px -35% 0px', threshold: 0.2 },
        );
        page.current
            ?.querySelectorAll('[data-acm-program]')
            .forEach((node) => observer.observe(node));
        return () => observer.disconnect();
    }, []);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    function finish() {
        setIntro(false);
        played = true;
        if (timer.current) clearTimeout(timer.current);
    }
    function replay() {
        setPaused(false);
        setIntro(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(finish, 4000);
    }
    useEffect(() => {
        if (reduced === null) return;
        if (!reduced && !played) {
            setIntro(true);
            timer.current = setTimeout(() => {
                setIntro(false);
                played = true;
            }, 4000);
        } else setIntro(false);
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, [reduced]);
    const enter =
        reduced || paused
            ? { initial: false as const, animate: { opacity: 1, y: 0 } }
            : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.1 },
                  transition: { duration: 0.5 },
              };
    return (
        <div
            ref={page}
            className={`machine-home ${paused || reduced ? 'machine-still' : ''} ${intro ? 'machine-intro-active' : 'machine-ready'}`}
        >
            {intro && <ChapterReveal onSkip={finish} />}
            <section className="machine-hero">
                <div className="machine-hero-top">
                    <div>
                        <button onClick={replay} disabled={!!reduced}>
                            <RotateCcw size={16} /> Replay the opening
                        </button>
                        <button
                            onClick={() => setPaused(!paused)}
                            disabled={!!reduced}
                            aria-pressed={paused}
                            aria-label={paused ? 'Resume motion' : 'Pause motion'}
                        >
                            {paused || reduced ? <Play size={16} /> : <Pause size={16} />}
                        </button>
                    </div>
                </div>
                <h1>
                    TEXAS ACM.
                    <br />
                    <span>UT AUSTIN.</span>
                </h1>
                <p className="machine-chapter-description">
                    The student chapter of the Association for Computing Machinery at The University
                    of Texas at Austin.
                </p>
                <div className="machine-hero-image">
                    <img
                        src="/studio/acmformal25.webp"
                        alt="Texas ACM students together at the chapter formal"
                        fetchPriority="high"
                    />
                    <div className="hero-image-grid" aria-hidden="true" />
                    <div className="machine-image-caption">
                        <p>
                            UT Austin’s computing community.
                            <br />
                            Open to every major. Free to join.
                        </p>
                        <a href="#join">
                            Join Texas ACM <ArrowUpRight size={27} />
                        </a>
                    </div>
                </div>
            </section>
            <section id="chapter" className="machine-about">
                <div className="machine-section-bar">
                    <Link href="/about">
                        Meet Texas ACM <ArrowUpRight size={18} />
                    </Link>
                </div>
                <motion.div className="machine-statement" {...enter}>
                    <h2>
                        THE TEXAS ACM
                        <br />
                        <span>COMMUNITY.</span>
                    </h2>
                    <div>
                        <p>
                            Texas ACM brings UT Austin students together through academic events,
                            industry connections, and a community that extends beyond the classroom.
                        </p>
                        <p>
                            Come to Pancakes with Professors, a company tech talk, Family Feud, or a
                            chapter retreat. All majors are welcome.
                        </p>
                    </div>
                </motion.div>
                <ChapterGallery still={paused} />
            </section>
            <section className="machine-programs" aria-label="Texas ACM programs">
                <div className="machine-program-layout">
                    <nav className="program-rail" aria-label="Chapter pillars">
                        {activities.map((a) => (
                            <a
                                key={a.name}
                                href={`#program-${a.name.toLowerCase()}`}
                                aria-current={
                                    activeProgram === a.name.toLowerCase() ? 'location' : undefined
                                }
                                onClick={() => setActiveProgram(a.name.toLowerCase())}
                            >
                                <span className="rail-contact" aria-hidden="true" />
                                {a.name}
                                <ArrowUpRight size={18} />
                            </a>
                        ))}
                    </nav>
                    <div className="program-panels">
                        {activities.map((a) => (
                            <motion.article
                                key={a.name}
                                id={`program-${a.name.toLowerCase()}`}
                                data-acm-program={a.name.toLowerCase()}
                                tabIndex={-1}
                                aria-labelledby={`program-heading-${a.name.toLowerCase()}`}
                                className="machine-program"
                                {...enter}
                            >
                                <div className="machine-program-title">
                                    <h2 id={`program-heading-${a.name.toLowerCase()}`}>
                                        {a.title}
                                    </h2>
                                    <p>{a.description}</p>
                                    <Link href={a.href}>
                                        {a.name} events <ArrowUpRight size={20} />
                                    </Link>
                                </div>
                                <div className="machine-program-image">
                                    <img src={`/studio/${a.src}.webp`} alt={a.alt} loading="lazy" />
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>
            <section className="machine-schedule">
                <div className="machine-section-bar">
                    <Link href="/calendar">
                        Full calendar <ArrowUpRight size={18} />
                    </Link>
                </div>
                <div className="machine-calendar-grid">
                    <div>
                        <h2>
                            TEXAS ACM
                            <br />
                            <span>EVENTS.</span>
                        </h2>
                        <PublishedCards kind="event" limit={3} />
                    </div>
                    <iframe
                        title="Texas ACM shared events calendar"
                        loading="lazy"
                        src="https://calendar.google.com/calendar/embed?src=utacm.org_tblt9l9gskpcunjovsjfh8ei0g%40group.calendar.google.com&ctz=America%2FChicago&mode=AGENDA"
                    />
                </div>
            </section>
            <section className="machine-resource">
                <div className="machine-section-bar">
                    <Link href="/resources">
                        All resources <ArrowUpRight size={18} />
                    </Link>
                </div>
                <div className="machine-tool-list">
                    {[
                        { title: 'CS A–Z', text: 'The UTCS vocabulary.', href: '/atoz' },
                        {
                            title: 'CS Guide',
                            text: 'Classes, campus, and what comes next.',
                            href: '/cs-guide',
                        },
                        {
                            title: 'Resume book',
                            text: 'Share your resume with chapter sponsors.',
                            href: '/resume-book',
                        },
                        {
                            title: 'Forms & signups',
                            text: 'Chapter applications and event signups.',
                            href: '/forms',
                        },
                        { title: 'FAQ', text: 'Membership and chapter information.', href: '/faq' },
                    ].map((r) => (
                        <Link href={r.href} key={r.href}>
                            <h3>{r.title}</h3>
                            <p>{r.text}</p>
                            <ArrowUpRight size={26} />
                        </Link>
                    ))}
                </div>
                <PublishedCards kind="resource" />
            </section>
            <div className="machine-instagram">
                <InstagramFeed />
            </div>
            <section className="machine-join" id="join">
                <div className="machine-section-bar">
                    <a href="mailto:pres@texasacm.org">
                        Contact the chapter <ArrowUpRight size={18} />
                    </a>
                </div>
                <h2>
                    JOIN
                    <br />
                    <span>TEXAS ACM.</span>
                </h2>
                <div className="machine-join-bottom">
                    <div>
                        <p>
                            Every major. Every starting point.
                            <br />
                            No dues. No application.
                        </p>
                        <a
                            href="https://discord.gg/tspJCpFFKx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="machine-discord"
                        >
                            Join the Discord <ArrowUpRight size={26} />
                        </a>
                        <a
                            className="machine-social"
                            href="https://www.instagram.com/texas_acm/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @texas_acm on Instagram ↗
                        </a>
                    </div>
                    <div className="machine-newsletter">
                        {process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === '1' ? (
                            <>
                                <h3>Texas ACM newsletter.</h3>
                                <EmailSignupForm />
                                <small>Continue to Mailchimp to subscribe.</small>
                            </>
                        ) : (
                            <>
                                <h3>
                                    Questions for
                                    <br />
                                    the chapter?
                                </h3>
                                <p>Contact the Texas ACM officers.</p>
                                <a
                                    className="machine-contact-officers"
                                    href="mailto:pres@texasacm.org"
                                >
                                    pres@texasacm.org <ArrowUpRight size={22} />
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
