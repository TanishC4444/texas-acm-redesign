'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, RotateCcw, Pause, Play } from 'lucide-react';
import ChapterReveal from './logo-reveal';
import InstagramFeed from './instagram-feed';
import EmailSignupForm from '@/components/EmailSignupForm';
import { PublishedCards } from './live-content';
let played = false;
const activities = [
    {
        name: 'Academics',
        title: 'Learn it. Then build it.',
        description:
            'Workshops, conversations with professors, and people to work through the hard parts with.',
        src: 'pwp',
        href: '/events#academics',
        alt: 'Texas ACM Pancakes with Professors gathering',
    },
    {
        name: 'Industry',
        title: 'Meet the people making it.',
        description:
            'Tech talks, company connections, and a closer look at where computer science can take you.',
        src: 'acmformal25',
        href: '/events#industry',
        alt: 'Texas ACM student community at formal',
    },
    {
        name: 'Community',
        title: 'Know someone in the room.',
        description: 'Game nights, retreats, and friendships that stick around after class.',
        src: 'familyfeud25',
        href: '/events#community',
        alt: 'Texas ACM Family Feud community event',
    },
];
export default function MachineHome() {
    const reduced = useReducedMotion();
    const [intro, setIntro] = useState(false);
    const [paused, setPaused] = useState(false);
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
            className={`machine-home ${paused || reduced ? 'machine-still' : ''} ${intro ? 'machine-intro-active' : 'machine-ready'}`}
        >
            {intro && <ChapterReveal onSkip={finish} />}
            <section className="machine-hero">
                <div className="machine-hero-top">
                    <span>
                        Association for Computing Machinery
                        <br />
                        The University of Texas at Austin
                    </span>
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
                    COMPUTING.
                    <br />
                    <span>WITH PEOPLE.</span>
                </h1>
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
                <div className="machine-hero-links">
                    <a href="#chapter">
                        Meet the chapter <ArrowDown size={18} />
                    </a>
                    <Link href="/calendar">
                        What’s coming up <ArrowUpRight size={18} />
                    </Link>
                    <a
                        href="https://discord.gg/tspJCpFFKx"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Find us on Discord <ArrowUpRight size={18} />
                    </a>
                </div>
            </section>
            <section id="chapter" className="machine-about">
                <div className="machine-section-bar">
                    <span>The chapter</span>
                    <Link href="/about">
                        Meet Texas ACM <ArrowUpRight size={18} />
                    </Link>
                </div>
                <motion.div className="machine-statement" {...enter}>
                    <h2>
                        THE MACHINERY
                        <br />
                        IS ONLY HALF
                        <br />
                        <span>THE STORY.</span>
                    </h2>
                    <div>
                        <p>
                            We’re the UT Austin chapter of the Association for Computing Machinery.
                            Computing brings us together. What we do with it—and who we do it
                            with—is where it gets interesting.
                        </p>
                        <p>
                            Meet a professor over pancakes. Ask a question at a tech talk. Join a
                            workshop, a retreat, or a game night. There’s room for you here.
                        </p>
                    </div>
                </motion.div>
                <div className="machine-photo-strip">
                    <img
                        src="/studio/acmretreat25.webp"
                        alt="Friends at an ACM retreat"
                        loading="lazy"
                    />
                    <img
                        src="/studio/acmhand25.webp"
                        alt="Texas ACM members at a campus organization table"
                        loading="lazy"
                    />
                </div>
            </section>
            <section className="machine-programs">
                <div className="machine-section-bar">
                    <span>What we do</span>
                    <Link href="/events">
                        All events <ArrowUpRight size={18} />
                    </Link>
                </div>
                {activities.map((a, i) => (
                    <motion.article key={a.name} className="machine-program" {...enter}>
                        <div className="machine-program-title">
                            <span>{a.name}</span>
                            <h2>{a.title}</h2>
                            <p>{a.description}</p>
                            <Link href={a.href}>
                                Explore {a.name.toLowerCase()} <ArrowUpRight size={20} />
                            </Link>
                        </div>
                        <Link
                            href={a.href}
                            className="machine-program-image"
                            aria-label={`Explore ${a.name.toLowerCase()} events`}
                        >
                            <img src={`/studio/${a.src}.webp`} alt={a.alt} loading="lazy" />
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </motion.article>
                ))}
            </section>
            <section className="machine-schedule">
                <div className="machine-section-bar">
                    <span>On the calendar</span>
                    <Link href="/calendar">
                        Full calendar <ArrowUpRight size={18} />
                    </Link>
                </div>
                <div className="machine-calendar-grid">
                    <div>
                        <h2>
                            SHOW UP.
                            <br />
                            <span>GET INTO IT.</span>
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
                    <span>The student toolkit</span>
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
                            text: 'Put your work in front of sponsors.',
                            href: '/resume-book',
                        },
                        {
                            title: 'Forms & signups',
                            text: 'Get straight to the right link.',
                            href: '/forms',
                        },
                        { title: 'FAQ', text: 'Good questions. Straight answers.', href: '/faq' },
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
                    <span>Get involved</span>
                    <a href="mailto:pres@texasacm.org">
                        Contact the chapter <ArrowUpRight size={18} />
                    </a>
                </div>
                <h2>
                    YOU DON’T HAVE
                    <br />
                    TO FIGURE IT
                    <br />
                    <span>OUT ALONE.</span>
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
                        <h3>
                            Chapter news.
                            <br />
                            Straight to your inbox.
                        </h3>
                        <EmailSignupForm />
                        <small>Continue to Mailchimp to subscribe.</small>
                    </div>
                </div>
            </section>
        </div>
    );
}
