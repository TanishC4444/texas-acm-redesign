'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Pause, Play, RotateCcw } from 'lucide-react';
import EmailSignupForm from '@/components/EmailSignupForm';
import { PublishedCards } from './live-content';
import { resourceLinks } from '@/lib/content';
import InstagramFeed from './instagram-feed';
import ChapterReveal from './logo-reveal';

const photos = [
    { src: 'acmformal25', label: 'Dressed up. All in.', alt: 'Texas ACM students at their formal' },
    {
        src: 'acmretreat25',
        label: 'Outside the algorithm.',
        alt: 'ACM friends together outdoors at retreat',
    },
    {
        src: 'pwp',
        label: 'Pancakes + professors.',
        alt: 'Students and professors at an ACM gathering',
    },
    { src: 'familyfeud25', label: 'Competitive? A little.', alt: 'Texas ACM Family Feud event' },
    { src: 'acmhand25', label: 'A very human network.', alt: 'Texas ACM community gathering' },
    {
        src: 'family-feud',
        label: 'Core memory material.',
        alt: 'Students playing Family Feud together',
    },
];
function Star({ className = '' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
            <path d="M50 0 58 32 85 15 68 42 100 50 68 58 85 85 58 68 50 100 42 68 15 85 32 58 0 50 32 42 15 15 42 32Z" />
        </svg>
    );
}
export default function UniverseHome() {
    const reduced = useReducedMotion();
    const [paused, setPaused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [booted, setBooted] = useState(false);
    const replayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(
        () => () => {
            if (replayTimer.current) clearTimeout(replayTimer.current);
        },
        [],
    );
    function replayIntro() {
        setPaused(false);
        if (replayTimer.current) clearTimeout(replayTimer.current);
        setLoading(true);
        setBooted(false);
        replayTimer.current = setTimeout(() => {
            setLoading(false);
            setBooted(true);
        }, 3200);
    }
    const root = useRef<HTMLDivElement>(null);
    const wall = useRef<HTMLDivElement>(null);
    const [wallVersion, setWallVersion] = useState(0);
    const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] });
    const drift = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 240]);
    const still = paused || !!reduced;
    useEffect(() => {
        if (reduced || sessionStorage.getItem('acm-chapter-v2')) {
            setLoading(false);
            setBooted(true);
            return;
        }
        setLoading(true);
        replayTimer.current = setTimeout(() => {
            setLoading(false);
            setBooted(true);
            sessionStorage.setItem('acm-chapter-v2', '1');
        }, 3200);
        return () => {
            if (replayTimer.current) clearTimeout(replayTimer.current);
        };
    }, [reduced]);
    const reveal = still
        ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
        : {
              initial: { opacity: 0, y: 48 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.12 },
              transition: { duration: 0.7 },
          };
    return (
        <div ref={root} className={`universe ${still ? 'motion-paused' : ''}`}>
            {loading && (
                <ChapterReveal
                    onSkip={() => {
                        setLoading(false);
                        setBooted(true);
                        if (replayTimer.current) clearTimeout(replayTimer.current);
                        sessionStorage.setItem('acm-chapter-v2', '1');
                    }}
                />
            )}
            <div className="universe-controls">
                <span>
                    <i /> TEXAS ACM / ONLINE
                </span>
                <div className="motion-actions">
                    <button onClick={replayIntro} disabled={!!reduced}>
                        Replay intro ↗
                    </button>
                    <button
                        onClick={() => setPaused(!paused)}
                        aria-pressed={paused}
                        disabled={!!reduced}
                    >
                        {still ? <Play size={13} /> : <Pause size={13} />}
                        {reduced ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion'}
                    </button>
                </div>
            </div>
            <section
                className={`universe-hero ${booted ? 'has-entered' : ''}`}
                aria-labelledby="universe-title"
            >
                <div className="orbital-grid" aria-hidden="true">
                    <div />
                    <div />
                    <div />
                </div>
                <span className="universe-location">
                    UT AUSTIN / STUDENT CHAPTER
                    <br />
                    30.2862° N / 97.7367° W
                </span>
                <span className="universe-edition">
                    UNIVERSITY OF TEXAS
                    <br />
                    AT AUSTIN ↗
                </span>
                <motion.div
                    className="planet planet-one"
                    style={still ? {} : { rotate }}
                    aria-hidden="true"
                >
                    <span />
                </motion.div>
                <div className="planet planet-two" aria-hidden="true" />
                <h1 id="universe-title">
                    <span className="hero-small">
                        Association for Computing Machinery · UT Austin
                    </span>
                    <span className="universe-title">
                        <img src="/texasacm-logo-primary.svg" alt="Texas ACM" />
                    </span>
                    <span className="hero-serif">
                        CS is better <em>together.</em>
                    </span>
                </h1>
                <motion.div
                    className="orbit-photo orbit-photo-one"
                    style={still ? {} : { y: drift }}
                >
                    <img src="/studio/acmformal25.webp" alt={photos[0].alt} fetchPriority="high" />
                    <span>FIG. 01 — YOUR FUTURE FRIENDS</span>
                </motion.div>
                <div className="orbit-photo orbit-photo-two">
                    <img src="/studio/acmretreat25.webp" alt={photos[1].alt} />
                    <span>TOUCH GRASS. MAKE FRIENDS.</span>
                </div>
                <div className="orbit-photo orbit-photo-three">
                    <img src="/studio/familyfeud25.webp" alt={photos[3].alt} />
                    <span>REAL PEOPLE. UNREAL ENERGY.</span>
                </div>
                <div className="hero-sticker" aria-hidden="true">
                    UTCS
                    <br />
                    <em>+ you.</em>
                    <Star />
                </div>
                <div className="universe-hero-bottom">
                    <p>
                        Your UT Austin computing community.
                        <br />
                        Workshops. Industry talks. People to build with.
                    </p>
                    <a className="universe-portal" href="#join">
                        <span>
                            ENTER THE
                            <br />
                            GROUP CHAT
                        </span>
                        <ArrowUpRight size={29} />
                    </a>
                    <a className="explore-down" href="#the-universe">
                        SCROLL INTO ORBIT
                        <ArrowDown size={17} />
                    </a>
                </div>
            </section>
            <div className="universe-marquee" aria-hidden="true">
                <div>
                    {[0, 1, 2, 3].map((i) => (
                        <span key={i}>
                            ASSOCIATION FOR COMPUTING MACHINERY <b>✳</b> UT AUSTIN <b>✳</b>{' '}
                            WORKSHOPS + TECH TALKS <b>✳</b> COMMUNITY + CAREERS <b>✳</b>{' '}
                        </span>
                    ))}
                </div>
            </div>
            <section className="universe-manifesto" id="the-universe">
                <span className="universe-label">01 / ESCAPE THE ORDINARY</span>
                <motion.h2 {...reveal}>
                    Computing.
                    <br />
                    With a<br />
                    <em>human</em>
                    <br />
                    <span>
                        connection.
                        <Star />
                    </span>
                </motion.h2>
                <motion.div className="manifesto-photo" {...reveal}>
                    <img
                        src="/studio/acmhand25.webp"
                        alt="Texas ACM students making memories together"
                        loading="lazy"
                    />
                    <span>THIS IS WHAT CONNECTION LOOKS LIKE.</span>
                </motion.div>
                <div className="manifesto-note">
                    <span className="scribble-arrow" aria-hidden="true">
                        ↳
                    </span>
                    <p>
                        We’re the Association for Computing Machinery at UT Austin. Builders,
                        overthinkers, game-night regulars, and your next favorite people. Every
                        major. Every starting point.
                    </p>
                    <Link href="/about">
                        Get to know the humans <ArrowUpRight size={19} />
                    </Link>
                </div>
                <span className="manifesto-seal" aria-hidden="true">
                    OPEN MINDS
                    <br />
                    OPEN DOORS
                    <br />✳<br />
                    TEXAS ACM
                </span>
            </section>
            <section className="universe-worlds">
                <div className="worlds-heading">
                    <span className="universe-label">02 / PICK YOUR PORTAL</span>
                    <h2>
                        Your chapter.
                        <br />
                        <em>Beyond the classroom.</em>
                    </h2>
                    <p>
                        Follow your curiosity.
                        <br />
                        There’s no wrong door.
                    </p>
                </div>
                <div className="worlds-grid">
                    {[
                        {
                            number: '01',
                            name: 'Make a little\nnoise.',
                            tag: 'COMMUNITY',
                            image: 'family-feud',
                            href: '/events#community',
                            description:
                                'Game nights. Retreats. The plans that become your favorite stories.',
                        },
                        {
                            number: '02',
                            name: 'Break it.\nBuild it better.',
                            tag: 'ACADEMICS',
                            image: 'pwp',
                            href: '/events#academics',
                            description:
                                'Pancakes with professors, hands-on workshops, and the freedom to ask why.',
                        },
                        {
                            number: '03',
                            name: 'Meet your\nnext what-if.',
                            tag: 'INDUSTRY',
                            image: 'acmformal25',
                            href: '/events#industry',
                            description:
                                'Tech talks, company connections, and a wider world of computing careers.',
                        },
                    ].map((w, i) => (
                        <motion.div
                            key={w.tag}
                            {...reveal}
                            transition={{ duration: 0.6, delay: still ? 0 : i * 0.1 }}
                        >
                            <Link className={`world-card world-${i}`} href={w.href}>
                                <div className="world-photo">
                                    <img src={`/studio/${w.image}.webp`} alt="" loading="lazy" />
                                    <span>
                                        {w.tag} / {w.number}
                                    </span>
                                    <Star />
                                </div>
                                <div className="world-copy">
                                    <h3>{w.name}</h3>
                                    <p>{w.description}</p>
                                    <span className="world-link">
                                        STEP INSIDE <ArrowUpRight size={24} />
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
            <section className="universe-events">
                <div>
                    <span className="universe-label">03 / INCOMING TRANSMISSIONS</span>
                    <h2>
                        On the calendar.
                        <br />
                        <em>See you there.</em>
                    </h2>
                    <Link className="universe-pill" href="/calendar">
                        Open the calendar <ArrowUpRight size={20} />
                    </Link>
                </div>
                <div className="universe-event-feed">
                    <span className="feed-label">
                        <i /> NEXT UP / TEXAS ACM
                    </span>
                    <PublishedCards kind="event" limit={3} />
                </div>
            </section>
            <section className="universe-wall">
                <div className="wall-heading">
                    <span className="universe-label">04 / PROOF WE GO OUTSIDE</span>
                    <h2>
                        Off the clock.
                        <br />
                        <em>Still ACM.</em>
                    </h2>
                    <p>
                        Little moments. Extremely good people.
                        <br />
                        <span>Drag the photos. Rearrange the memories.</span>
                    </p>
                    <button className="wall-reset" onClick={() => setWallVersion((k) => k + 1)}>
                        <RotateCcw size={15} /> Reset the wall
                    </button>
                </div>
                <PhotoWall key={wallVersion} wall={wall} />
            </section>
            <InstagramFeed />
            <section className="universe-tools">
                <div className="tool-planet" aria-hidden="true">
                    <Star />
                    <span>
                        KNOWLEDGE
                        <br />
                        IS A GROUP
                        <br />
                        <em>PROJECT.</em>
                    </span>
                </div>
                <div className="tools-list">
                    <span className="universe-label">05 / TAKE SOMETHING WITH YOU</span>
                    {resourceLinks.map((r, i) => (
                        <Link href={r.href} key={r.href}>
                            <span className="tool-num">0{i + 1}</span>
                            <span>
                                <h3>{r.title}</h3>
                                <p>{r.description}</p>
                            </span>
                            <ArrowUpRight />
                        </Link>
                    ))}
                    <PublishedCards kind="resource" />
                </div>
            </section>
            <div className="universe-announcements">
                <PublishedCards kind="announcement" />
            </div>
            <section id="join" className="universe-join">
                <span className="universe-label">06 / YOUR COORDINATES ARE HERE</span>
                <h2>
                    You. Us.
                    <br />
                    <em>Let’s build something.</em>
                </h2>
                <Star className="join-star" />
                <div className="join-orbit" aria-hidden="true" />
                <div className="universe-join-bottom">
                    <div>
                        <p>
                            No application. No dues. No need to have it all figured out.
                            <br />
                            Just show up. We’ll save you a spot.
                        </p>
                        <a
                            className="universe-pill"
                            href="https://discord.gg/tspJCpFFKx"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Find us on Discord <ArrowUpRight size={22} />
                        </a>
                        <a
                            className="join-instagram"
                            href="https://www.instagram.com/texas_acm/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            The ongoing story: @texas_acm ↗
                        </a>
                    </div>
                    <div className="universe-mail">
                        <span>LET GOOD THINGS FIND YOU.</span>
                        <h3>
                            Chapter notes.
                            <br />
                            <em>In your inbox.</em>
                        </h3>
                        <EmailSignupForm />
                        <small>Continue to Mailchimp to subscribe.</small>
                    </div>
                </div>
            </section>
        </div>
    );
}

function PhotoWall({ wall }: { wall: React.RefObject<HTMLDivElement | null> }) {
    return (
        <div className="memory-canvas" ref={wall}>
            {photos.map((photo, i) => (
                <motion.div
                    key={photo.src}
                    className={`memory memory-${i}`}
                    drag
                    dragConstraints={wall}
                    dragElastic={0.12}
                    dragMomentum={false}
                    whileDrag={{ scale: 1.06, zIndex: 20, rotate: 0 }}
                    aria-label={photo.label}
                >
                    <img
                        src={`/studio/${photo.src}.webp`}
                        alt={photo.alt}
                        loading="lazy"
                        draggable={false}
                    />
                    <span>
                        {photo.label}
                        <b>↗</b>
                    </span>
                </motion.div>
            ))}
            <span className="wall-doodle" aria-hidden="true">
                good times.
                <br />
                <em>no algorithm.</em> ✳
            </span>
            <p className="archive-credit">
                FROM THE TEXAS ACM PHOTO ARCHIVE / NOT A LIVE INSTAGRAM FEED
            </p>
        </div>
    );
}
