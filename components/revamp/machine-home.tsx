'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight, RotateCcw, Pause, Play } from 'lucide-react';
import ChapterReveal, { INTRO_DURATION } from './logo-reveal';
import ChapterGallery from './chapter-gallery';
import ManagedPhoto from './site-photos';
import { SoundToggle } from './site-sound';
import InstagramFeed from './instagram-feed';
import { PublishedCards } from './live-content';
let played = false;
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
        timer.current = setTimeout(finish, INTRO_DURATION);
    }
    useEffect(() => {
        if (reduced === null) return;
        if (!reduced && !played) {
            setIntro(true);
            timer.current = setTimeout(() => {
                setIntro(false);
                played = true;
            }, INTRO_DURATION);
        } else setIntro(false);
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, [reduced]);
    return (
        <div
            className={`minimal-home ${paused || reduced ? 'machine-still' : ''} ${intro ? 'machine-intro-active' : 'machine-ready'}`}
        >
            {intro && <ChapterReveal onSkip={finish} />}
            <section className="minimal-hero">
                <div className="home-controls">
                    <button data-track="replay-intro" onClick={replay} disabled={!!reduced}>
                        <RotateCcw size={16} />
                        <span>Replay intro</span>
                    </button>
                    <button
                        data-track="toggle-motion"
                        onClick={() => setPaused(!paused)}
                        disabled={!!reduced}
                        aria-pressed={paused}
                        aria-label={paused ? 'Resume motion' : 'Pause motion'}
                    >
                        {paused || reduced ? <Play size={17} /> : <Pause size={17} />}
                    </button>
                    <SoundToggle onEnable={reduced ? undefined : replay} />
                </div>
                <h1>
                    <span>Texas</span> <span>ACM.</span>
                </h1>
                <p>The computing community at UT Austin. Open to all majors.</p>
                <div className="minimal-hero-actions" id="join">
                    <a
                        className="button button-dark"
                        href="https://discord.gg/tspJCpFFKx"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Join Texas ACM <ArrowUpRight size={18} />
                    </a>
                    <Link href="/events">
                        Explore events <ArrowUpRight size={18} />
                    </Link>
                </div>
                <ManagedPhoto
                    slot="home"
                    className="minimal-cover"
                    src="/studio/acmformal25.webp"
                    alt="Texas ACM students at the chapter formal"
                    fetchPriority="high"
                />
            </section>
            <section className="minimal-events">
                <div className="minimal-section-heading">
                    <h2>Upcoming events</h2>
                    <Link href="/calendar">
                        Full calendar <ArrowUpRight size={17} />
                    </Link>
                </div>
                <PublishedCards kind="event" limit={3} hideEmpty />
                <iframe
                    title="Texas ACM shared events calendar"
                    loading="lazy"
                    src="https://calendar.google.com/calendar/embed?src=utacm.org_tblt9l9gskpcunjovsjfh8ei0g%40group.calendar.google.com&ctz=America%2FChicago&mode=AGENDA"
                />
            </section>
            <section className="minimal-community">
                <div className="minimal-section-heading">
                    <div>
                        <h2>About the chapter</h2>
                        <p>
                            Academic support, industry connections, and a community beyond the
                            classroom.
                        </p>
                    </div>
                    <Link href="/about">
                        Meet Texas ACM <ArrowUpRight size={17} />
                    </Link>
                </div>
                <ChapterGallery still={paused} />
            </section>
            <section className="minimal-resource">
                <Link href="/resources">
                    <div>
                        <h2>Student resources</h2>
                        <p>CS guides, resumes, forms, and FAQs.</p>
                    </div>
                    <ArrowUpRight size={28} />
                </Link>
            </section>
            <InstagramFeed compact />
        </div>
    );
}
