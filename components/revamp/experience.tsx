'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    ArrowUpRight,
    ArrowLeft,
    ArrowRight,
    Pause,
    Play,
    RotateCcw,
    CalendarDays,
    MessageCircle,
    Code2,
    Users,
    Radio,
    X,
    ExternalLink,
} from 'lucide-react';
import ChapterReveal from './logo-reveal';
import InstagramFeed from './instagram-feed';
import { PublishedCards } from './live-content';
import EmailSignupForm from '@/components/EmailSignupForm';
const rooms = [
    { id: 'home', name: 'The chapter', icon: Radio },
    { id: 'people', name: 'The people', icon: Users },
    { id: 'events', name: 'What’s on', icon: CalendarDays },
    { id: 'tools', name: 'The toolkit', icon: Code2 },
    { id: 'connect', name: 'Get connected', icon: MessageCircle },
];
let introPlayed = false;
export default function ChapterExperience() {
    const reduced = useReducedMotion();
    const [room, setRoom] = useState('home');
    const [intro, setIntro] = useState(false);
    const [paused, setPaused] = useState(false);
    const [filter, setFilter] = useState('original');
    const [social, setSocial] = useState(false);
    const [calendar, setCalendar] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stage = useRef<HTMLElement>(null);
    function finishIntro() {
        setIntro(false);
        if (timer.current) clearTimeout(timer.current);
        introPlayed = true;
    }
    function replay() {
        setPaused(false);
        setIntro(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(finishIntro, 3200);
    }
    useEffect(() => {
        if (reduced === null) return;
        if (reduced || introPlayed) {
            setIntro(false);
        } else {
            setIntro(true);
            timer.current = setTimeout(() => {
                setIntro(false);
                introPlayed = true;
            }, 3200);
        }
        const hash = () => {
            if (location.hash === '#join') setRoom('connect');
        };
        hash();
        window.addEventListener('hashchange', hash);
        return () => {
            if (timer.current) clearTimeout(timer.current);
            window.removeEventListener('hashchange', hash);
        };
    }, [reduced]);
    useEffect(() => {
        const close = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSocial(false);
                setCalendar(false);
                setSelected(null);
            }
        };
        document.addEventListener('keydown', close);
        return () => document.removeEventListener('keydown', close);
    }, []);
    useEffect(() => {
        if (!social && !selected && !calendar) return;
        const previous = document.activeElement as HTMLElement | null;
        dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
        const trap = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;
            const elements = dialogRef.current?.querySelectorAll<HTMLElement>(
                'a[href],button,input,select,textarea,iframe,[tabindex="0"]',
            );
            if (!elements?.length) return;
            const first = elements[0],
                last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', trap);
        return () => {
            document.removeEventListener('keydown', trap);
            if (previous?.isConnected) previous.focus();
            else document.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus();
        };
    }, [social, selected, calendar]);
    const index = rooms.findIndex((r) => r.id === room);
    function navigate(id: string) {
        setRoom(id);
        document.getElementById(`tab-${id}`)?.focus();
        setSelected(null);
        if (stage.current) stage.current.scrollTop = 0;
        if (location.hash === '#join' && id !== 'connect')
            history.replaceState(null, '', location.pathname);
    }
    return (
        <div
            className={`chapter-space filter-${filter} ${paused || reduced ? 'space-paused' : ''}`}
        >
            {intro && <ChapterReveal onSkip={finishIntro} />}
            <div className="space-toolbar">
                <div className="room-switch" role="tablist" aria-label="Explore the chapter">
                    {rooms.map((r) => (
                        <button
                            key={r.id}
                            role="tab"
                            aria-label={r.name}
                            title={r.name}
                            aria-selected={room === r.id}
                            tabIndex={room === r.id ? 0 : -1}
                            aria-controls={`room-${r.id}`}
                            id={`tab-${r.id}`}
                            onClick={() => navigate(r.id)}
                            onKeyDown={(e) => {
                                const current = rooms.findIndex((item) => item.id === r.id);
                                const next =
                                    e.key === 'ArrowRight'
                                        ? (current + 1) % rooms.length
                                        : e.key === 'ArrowLeft'
                                          ? (current + rooms.length - 1) % rooms.length
                                          : e.key === 'Home'
                                            ? 0
                                            : e.key === 'End'
                                              ? rooms.length - 1
                                              : -1;
                                if (next >= 0) {
                                    e.preventDefault();
                                    navigate(rooms[next].id);
                                    document.getElementById(`tab-${rooms[next].id}`)?.focus();
                                }
                            }}
                        >
                            <r.icon size={16} />
                            <span>{r.name}</span>
                        </button>
                    ))}
                </div>
                <div className="space-actions">
                    <button
                        onClick={() => setPaused(!paused)}
                        aria-pressed={paused}
                        disabled={!!reduced}
                        aria-label={paused ? 'Resume animation' : 'Pause animation'}
                    >
                        {paused || reduced ? <Play size={17} /> : <Pause size={17} />}
                    </button>
                    <button onClick={replay} disabled={!!reduced} aria-label="Replay logo intro">
                        <RotateCcw size={17} />
                    </button>
                </div>
            </div>
            <section className="experience-stage" ref={stage} aria-label="Chapter explorer">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={room}
                        id={`room-${room}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${room}`}
                        className={`experience-room room-${room}`}
                        initial={reduced ? false : { opacity: 0, scale: 0.96, rotateY: 5 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={reduced ? {} : { opacity: 0, scale: 1.035, rotateY: -5 }}
                        transition={{ duration: reduced ? 0 : 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        {room === 'home' && (
                            <div
                                className={`chapter-scene ${intro ? 'scene-hidden' : 'scene-arrived'}`}
                                onPointerMove={(e) => {
                                    if (reduced || paused || e.pointerType !== 'mouse') return;
                                    const r = e.currentTarget.getBoundingClientRect();
                                    e.currentTarget.style.setProperty(
                                        '--look-x',
                                        `${(-(e.clientY - r.top - r.height / 2) / r.height) * 5}deg`,
                                    );
                                    e.currentTarget.style.setProperty(
                                        '--look-y',
                                        `${((e.clientX - r.left - r.width / 2) / r.width) * 5}deg`,
                                    );
                                }}
                                onPointerLeave={(e) => {
                                    e.currentTarget.style.setProperty('--look-x', '0deg');
                                    e.currentTarget.style.setProperty('--look-y', '0deg');
                                }}
                            >
                                <div className="scene-grid" aria-hidden="true" />
                                <div className="scene-glow glow-blue" />
                                <div className="scene-glow glow-orange" />
                                <div className="spatial-ring ring-one" aria-hidden="true" />
                                <div className="spatial-ring ring-two" aria-hidden="true" />
                                <div className="scene-center">
                                    <span className="chapter-location">
                                        The University of Texas at Austin
                                    </span>
                                    <h1>
                                        <img
                                            src="/texasacm-logo-primary.svg"
                                            alt="Texas ACM"
                                            className="logo-light"
                                        />
                                        <img
                                            src="/texasacm-logo-white.svg"
                                            alt="Texas ACM"
                                            className="logo-dark"
                                        />
                                    </h1>
                                    <p>
                                        Computer science.
                                        <br />
                                        <strong>Better with your people.</strong>
                                    </p>
                                    <button
                                        className="space-cta"
                                        onClick={() => navigate('people')}
                                    >
                                        Find your people <ArrowUpRight size={21} />
                                    </button>
                                </div>
                                <button
                                    className="scene-photo photo-left"
                                    onClick={() => {
                                        navigate('people');
                                        setSelected('acmformal25');
                                    }}
                                    aria-label="Explore photos of the ACM community"
                                >
                                    <img
                                        src="/studio/acmformal25.webp"
                                        alt="Texas ACM community formal"
                                    />
                                    <span>
                                        The people make it.
                                        <ArrowUpRight size={18} />
                                    </span>
                                </button>
                                <button
                                    className="scene-photo photo-right"
                                    onClick={() => navigate('events')}
                                >
                                    <img
                                        src="/studio/pwp.webp"
                                        alt="Pancakes with Professors at Texas ACM"
                                    />
                                    <span>
                                        Pancakes with Professors
                                        <ArrowUpRight size={18} />
                                    </span>
                                </button>
                                <button
                                    className="scene-chip chip-discord"
                                    onClick={() => navigate('connect')}
                                >
                                    <MessageCircle size={25} />
                                    <span>Your next group chat</span>
                                    <ArrowUpRight size={20} />
                                </button>
                                <button
                                    className="scene-chip chip-calendar"
                                    onClick={() => navigate('events')}
                                >
                                    <CalendarDays size={25} />
                                    <span>Make some plans</span>
                                    <ArrowUpRight size={20} />
                                </button>
                                <div className="glass-cube" aria-hidden="true">
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                    <span>&lt;/&gt;</span>
                                </div>
                            </div>
                        )}
                        {room === 'people' && (
                            <div className="people-room">
                                <div className="room-heading">
                                    <h2>
                                        Good people.
                                        <br />
                                        <span>Great company.</span>
                                    </h2>
                                    <p>
                                        Austin adventures, game nights, and a community that makes
                                        UTCS feel like home.
                                    </p>
                                    <Link href="/about" className="space-cta">
                                        Meet the chapter <ArrowUpRight size={19} />
                                    </Link>
                                </div>
                                <div className="spatial-photos">
                                    {[
                                        { src: 'acmretreat25', name: 'Retreat mode' },
                                        { src: 'acmformal25', name: 'Clean up, show up' },
                                        {
                                            src: 'familyfeud25',
                                            name: 'A little friendly competition',
                                        },
                                        { src: 'acmhand25', name: 'Find us around campus' },
                                    ].map((p, i) => (
                                        <button
                                            className={`spatial-photo spatial-photo-${i}`}
                                            key={p.src}
                                            onClick={() => setSelected(p.src)}
                                        >
                                            <img src={`/studio/${p.src}.webp`} alt={p.name} />
                                            <span>
                                                {p.name}
                                                <ArrowUpRight size={18} />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {room === 'events' && (
                            <div className="events-room">
                                <div className="room-heading">
                                    <h2>
                                        Out of class.
                                        <br />
                                        <span>Into something.</span>
                                    </h2>
                                    <p>
                                        Talks, workshops, and community nights. Start with the
                                        calendar.
                                    </p>
                                    <button className="space-cta" onClick={() => setCalendar(true)}>
                                        Open calendar <ArrowUpRight size={20} />
                                    </button>
                                </div>
                                <div className="event-room-content">
                                    <div className="activity-tiles">
                                        <Link href="/events#academics">
                                            <img
                                                src="/studio/pwp.webp"
                                                alt="Students learning together"
                                            />
                                            <span>
                                                Learn together
                                                <Code2 />
                                            </span>
                                        </Link>
                                        <Link href="/events#community">
                                            <img
                                                src="/studio/family-feud.webp"
                                                alt="ACM game night"
                                            />
                                            <span>
                                                Hang out
                                                <Users />
                                            </span>
                                        </Link>
                                        <Link href="/events#industry">
                                            <img
                                                src="/studio/acmformal25.webp"
                                                alt="ACM students together"
                                            />
                                            <span>
                                                Meet what’s next
                                                <ArrowUpRight />
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="glass-feed">
                                        <PublishedCards kind="event" limit={3} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {room === 'tools' && (
                            <div className="tools-room">
                                <div className="room-heading">
                                    <h2>
                                        Less lost.
                                        <br />
                                        <span>More ready.</span>
                                    </h2>
                                    <p>Built by students who have been there.</p>
                                </div>
                                <div className="spatial-tools">
                                    {[
                                        {
                                            title: 'CS A–Z',
                                            text: 'Decode the UTCS vocabulary.',
                                            href: '/atoz',
                                            icon: '{ }',
                                        },
                                        {
                                            title: 'CS Guide',
                                            text: 'Your next step, a little clearer.',
                                            href: '/cs-guide',
                                            icon: '↗',
                                        },
                                        {
                                            title: 'Resume book',
                                            text: 'Put your work out there.',
                                            href: '/resume-book',
                                            icon: '[ ]',
                                        },
                                        {
                                            title: 'Questions?',
                                            text: 'Get straight to the answer.',
                                            href: '/faq',
                                            icon: '?',
                                        },
                                        {
                                            title: 'Forms',
                                            text: 'The links you came looking for.',
                                            href: '/forms',
                                            icon: '✓',
                                        },
                                        {
                                            title: 'All resources',
                                            text: 'Everything in one place.',
                                            href: '/resources',
                                            icon: '+',
                                        },
                                    ].map((t) => (
                                        <Link key={t.href} href={t.href}>
                                            <span className="tool-object">{t.icon}</span>
                                            <h3>{t.title}</h3>
                                            <p>{t.text}</p>
                                            <ArrowUpRight />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {room === 'connect' && (
                            <div className="connect-room" id="join">
                                <div className="room-heading">
                                    <h2>
                                        You’re in.
                                        <br />
                                        <span>Say hello.</span>
                                    </h2>
                                    <p>
                                        Every major. No dues. No application.
                                        <br />
                                        Just a curiosity about computing—and the people around it.
                                    </p>
                                </div>
                                <div className="connection-grid">
                                    <a
                                        className="connection-discord"
                                        href="https://discord.gg/tspJCpFFKx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircle size={52} />
                                        <h3>
                                            Meet us
                                            <br />
                                            on Discord.
                                        </h3>
                                        <p>The group chat starts here.</p>
                                        <span>
                                            Join the community <ArrowUpRight />
                                        </span>
                                    </a>
                                    <button
                                        className="connection-instagram"
                                        onClick={() => setSocial(true)}
                                    >
                                        <img
                                            src="/studio/acmretreat25.webp"
                                            alt="ACM friends at retreat"
                                        />
                                        <span>
                                            <h3>Life at ACM.</h3>Explore Instagram updates{' '}
                                            <ArrowUpRight />
                                        </span>
                                    </button>
                                    <div className="connection-mail">
                                        <h3>Keep in touch.</h3>
                                        <p>Chapter news in your inbox.</p>
                                        <EmailSignupForm />
                                        <a href="mailto:pres@texasacm.org">
                                            Contact the chapter <ArrowUpRight size={17} />
                                        </a>
                                        <Link href="/calendar">
                                            See the shared calendar <CalendarDays size={17} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </section>
            <div className="space-bottom">
                <div className="look-controls" aria-label="Photo treatment">
                    <span>Photo look</span>
                    {['original', 'vivid', 'blueprint'].map((f) => (
                        <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="room-pager">
                    <button
                        onClick={() =>
                            navigate(rooms[(index + rooms.length - 1) % rooms.length].id)
                        }
                        aria-label="Previous chapter scene"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <span>
                        {index + 1} / {rooms.length}
                    </span>
                    <button
                        onClick={() => navigate(rooms[(index + 1) % rooms.length].id)}
                        aria-label="Next chapter scene"
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
            {(social || selected || calendar) && (
                <div
                    className="experience-dialog-backdrop"
                    onClick={() => {
                        setSocial(false);
                        setCalendar(false);
                        setSelected(null);
                    }}
                >
                    <div
                        className="experience-dialog"
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={
                            social
                                ? 'Chapter Instagram updates'
                                : calendar
                                  ? 'Chapter calendar'
                                  : 'Chapter photo'
                        }
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="dialog-close"
                            onClick={() => {
                                setSocial(false);
                                setCalendar(false);
                                setSelected(null);
                            }}
                            aria-label="Close panel"
                        >
                            <X />
                        </button>
                        {social ? (
                            <InstagramFeed />
                        ) : calendar ? (
                            <div className="calendar-panel">
                                <h2>The chapter calendar.</h2>
                                <iframe
                                    title="Texas ACM shared Google Calendar"
                                    src="https://calendar.google.com/calendar/embed?src=utacm.org_tblt9l9gskpcunjovsjfh8ei0g%40group.calendar.google.com&ctz=America%2FChicago&mode=AGENDA"
                                />
                                <Link href="/calendar">
                                    Open calendar page <ArrowUpRight size={18} />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <img
                                    className="expanded-photo"
                                    src={`/studio/${selected}.webp`}
                                    alt="From the Texas ACM community photo archive"
                                />
                                <a
                                    href="https://www.instagram.com/texas_acm/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    More chapter moments <ExternalLink size={18} />
                                </a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
