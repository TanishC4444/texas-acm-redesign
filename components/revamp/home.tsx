import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Sparkles, Code2, Heart, Briefcase, Command } from 'lucide-react';
import EmailSignupForm from '@/components/EmailSignupForm';
import { PublishedCards } from './live-content';
import { resourceLinks } from '@/lib/content';
export default function StudioHome({ night = false }: { night?: boolean }) {
    return (
        <div className={`studio-home ${night ? 'after-hours' : ''}`}>
            <section className="studio-hero">
                <div className="hero-grid-bg" aria-hidden="true" />
                <div className="hero-copy">
                    <div className="hero-kicker">
                        <span className="live-dot" /> UNIVERSITY OF TEXAS AT AUSTIN{' '}
                        <span className="kicker-rule" />
                    </div>
                    <h1>
                        Your people.
                        <br />
                        Your next
                        <br />
                        <span className="hero-outline">
                            big thing<span className="orange-period">.</span>
                        </span>
                    </h1>
                    <p>
                        A little curiosity. A lot of community. We’re Texas ACM—your people in
                        computer science, and whatever comes next.
                    </p>
                    <div className="hero-cta">
                        <a className="button button-dark" href="#join">
                            Find your people <ArrowUpRight size={20} />
                        </a>
                        <Link className="hero-secondary" href="/events">
                            See what’s happening <ArrowDown size={17} />
                        </Link>
                    </div>
                    <div className="hero-footnote">
                        <span className="tiny-avatars">
                            <img src="/officer-headshots-2025-26/jayden.jpg" alt="" />
                            <img src="/officer-headshots-2025-26/cienna.jpg" alt="" />
                            <img src="/officer-headshots-2025-26/suhas.jpg" alt="" />
                        </span>
                        <span>
                            All majors welcome.
                            <br />
                            <strong>Always a place for you.</strong>
                        </span>
                    </div>
                </div>
                <div className="hero-art">
                    <div className="orbit-stamp" aria-hidden="true">
                        HELLO, WORLD!
                        <Sparkles size={32} /> STAY CURIOUS
                    </div>
                    <div className="photo-window">
                        <div className="window-bar">
                            <span>
                                <i />
                                <i />
                                <i />
                            </span>
                            <span>community.exe</span>
                            <Command size={13} />
                        </div>
                        <div className="hero-photo">
                            <img
                                src="/studio/acmformal25.webp"
                                alt="Texas ACM students together at a community formal"
                                fetchPriority="high"
                            />
                            <div className="photo-caption">
                                <span>
                                    GOOD COMPANY.
                                    <br />
                                    GREAT POSSIBILITIES.
                                </span>
                                <span className="photo-arrow">↗</span>
                            </div>
                        </div>
                        <div className="window-status">
                            <span className="live-dot" /> CONNECTED TO YOUR COMMUNITY{' '}
                            <span>ATX / TX</span>
                        </div>
                    </div>
                    <div className="sticker sticker-cream">
                        come for the code.
                        <br />
                        <em>stay for the people.</em>
                    </div>
                    <div className="sticker-cross" aria-hidden="true">
                        ✳
                    </div>
                    <div className="art-coordinate">
                        30.2862° N &nbsp; 97.7367° W<br />
                        GATES DELL COMPLEX / AUSTIN, TX
                    </div>
                </div>
                <div className="hero-index">
                    <span>01 / A PLACE TO BEGIN</span>
                    <span>
                        SCROLL TO EXPLORE <ArrowDown size={13} />
                    </span>
                </div>
            </section>
            <div className="ticker" aria-hidden="true">
                <div>
                    {[0, 1].map((n) => (
                        <span key={n}>
                            BUILD SOMETHING <b>✳</b> MEET YOUR PEOPLE <b>✳</b> STAY CURIOUS <b>✳</b>{' '}
                            MAKE IT HAPPEN <b>✳</b>{' '}
                        </span>
                    ))}
                </div>
            </div>
            <section className="studio-section happening">
                <div className="section-heading">
                    <div>
                        <span className="eyebrow">02 / GET OUT THERE</span>
                        <h2>
                            Good things
                            <br />
                            are <em>happening.</em>
                        </h2>
                    </div>
                    <div>
                        <p>
                            Tech talks, late-night ideas, and the kind of plans
                            <br className="desktop-only" /> you’ll be glad you said yes to.
                        </p>
                        <Link className="text-link" href="/calendar">
                            The full calendar <ArrowUpRight size={18} />
                        </Link>
                    </div>
                </div>
                <PublishedCards kind="event" limit={3} />
                <div className="program-grid">
                    <Link href="/events#industry" className="program-card program-green">
                        <span className="program-number">01 / INDUSTRY</span>
                        <Briefcase size={32} />
                        <h3>
                            Your next
                            <br />
                            open door.
                        </h3>
                        <p>
                            Meet the people building what’s next. Tech talks, company visits, and
                            real connections.
                        </p>
                        <span className="round-arrow">
                            <ArrowUpRight />
                        </span>
                    </Link>
                    <Link href="/events#academics" className="program-card program-cream">
                        <span className="program-number">02 / ACADEMICS</span>
                        <Code2 size={34} />
                        <h3>
                            Learn it.
                            <br />
                            Build it. Break it.
                        </h3>
                        <p>
                            Hands-on workshops, conversations with professors, and room to figure
                            things out.
                        </p>
                        <span className="round-arrow">
                            <ArrowUpRight />
                        </span>
                    </Link>
                    <Link href="/events#community" className="program-card program-orange">
                        <span className="program-number">03 / COMMUNITY</span>
                        <Heart size={34} />
                        <h3>
                            More than
                            <br />
                            your major.
                        </h3>
                        <p>
                            Game nights, retreats, and familiar faces. The best part of CS is the
                            people.
                        </p>
                        <span className="round-arrow">
                            <ArrowUpRight />
                        </span>
                    </Link>
                </div>
            </section>
            <section className="community-strip">
                <div className="community-photo">
                    <img
                        src="/studio/familyfeud25.webp"
                        alt="Students at Texas ACM’s Family Feud event"
                        loading="lazy"
                    />
                    <span className="photo-tag">FILE UNDER: GOOD TIMES ↗</span>
                </div>
                <div className="community-copy">
                    <span className="eyebrow">A CLUB. A COMMUNITY. YOUR CORNER.</span>
                    <h2>
                        Big ideas.
                        <br />
                        Even better
                        <br />
                        <em>company.</em>
                    </h2>
                    <p>
                        We’re here to make UTCS feel a little more like home. No application. No
                        membership dues. Just bring yourself.
                    </p>
                    <Link className="button button-dark" href="/about">
                        Meet Texas ACM <ArrowUpRight size={18} />
                    </Link>
                    <span className="handdrawn-star" aria-hidden="true">
                        ✳
                    </span>
                </div>
            </section>
            <section className="studio-section resource-section">
                <div className="section-heading">
                    <div>
                        <span className="eyebrow">03 / A HEAD START</span>
                        <h2>
                            A little help.
                            <br />
                            <em>A long way.</em>
                        </h2>
                    </div>
                    <Link className="text-link" href="/resources">
                        Explore the toolkit <ArrowUpRight size={18} />
                    </Link>
                </div>
                <div className="resource-grid">
                    {resourceLinks.map((r, i) => (
                        <Link className="resource-tile" href={r.href} key={r.href}>
                            <span className="eyebrow">{r.label}</span>
                            <span className="resource-icon" aria-hidden="true">
                                {r.icon}
                            </span>
                            <h3>{r.title}</h3>
                            <p>{r.description}</p>
                            <span className="resource-index">
                                0{i + 1}
                                <ArrowUpRight size={20} />
                            </span>
                        </Link>
                    ))}
                </div>
                <PublishedCards kind="resource" />
            </section>
            <section className="notice-section studio-section">
                <PublishedCards kind="announcement" />
            </section>
            <section id="join" className="join-studio">
                <div>
                    <span className="eyebrow">04 / YOU’RE INVITED</span>
                    <h2>
                        Your next
                        <br />
                        chapter <em>starts here.</em>
                    </h2>
                    <p>
                        Free to join. Open to every major. Find us on Discord or get the latest in
                        your inbox.
                    </p>
                    <a
                        className="button button-dark"
                        href="https://discord.gg/tspJCpFFKx"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Join our Discord <ArrowUpRight size={18} />
                    </a>
                </div>
                <div className="signup-window">
                    <div className="window-bar">
                        <span>
                            <i />
                            <i />
                            <i />
                        </span>
                        <span>stay_in_the_loop.txt</span>
                        <span>↗</span>
                    </div>
                    <div className="signup-body">
                        <span className="eyebrow">THE GOOD STUFF, IN YOUR INBOX.</span>
                        <h3>
                            Don’t miss
                            <br />
                            your next thing.
                        </h3>
                        <EmailSignupForm />
                        <small>Mailchimp opens in a new tab to complete your subscription.</small>
                    </div>
                </div>
            </section>
            <section className="instagram-strip">
                <span className="eyebrow">THE GROUP CHAT, BUT PUBLIC.</span>
                <h2>
                    Life at ACM <span>↗</span>
                </h2>
                <a
                    className="text-link"
                    href="https://www.instagram.com/texas_acm/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Follow @texas_acm <ArrowUpRight size={18} />
                </a>
                <div className="instagram-photos">
                    {[
                        '/studio/pwp.webp',
                        '/studio/acmretreat25.webp',
                        '/studio/family-feud.webp',
                        '/studio/acmhand25.webp',
                    ].map((src, i) => (
                        <a
                            href="https://www.instagram.com/texas_acm/"
                            key={src}
                            aria-label={`Explore Texas ACM community photos on Instagram, photo ${i + 1}`}
                        >
                            <img
                                src={src}
                                alt={
                                    [
                                        'Pancakes with Professors',
                                        'ACM retreat outdoors',
                                        'Family Feud community event',
                                        'Texas ACM community gathering',
                                    ][i]
                                }
                                loading="lazy"
                            />
                        </a>
                    ))}
                </div>
                <p className="image-note">
                    From the ACM photo archive. See Instagram for the latest posts.
                </p>
            </section>
        </div>
    );
}
