'use client';

import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import ManagedPhoto from '@/components/revamp/site-photos';
import { useRuntime } from './provider';

export default function RuntimeHero() {
    const { settings } = useRuntime();
    const reduced = useReducedMotion();
    const animate = settings.motion === 'full' || (settings.motion === 'auto' && !reduced);
    return (
        <section className="acm-hero" aria-labelledby="home-heading">
            <div className="acm-hero-copy">
                <p className="acm-eyebrow">
                    <span className="acm-status-dot" /> YOUR PEOPLE. YOUR NEXT CHAPTER.
                </p>
                <h1 id="home-heading">
                    A place to
                    <br />
                    think <span>bigger.</span>
                </h1>
                <p className="acm-hero-description">
                    Computing brings us together.
                    <br />
                    The people make it Texas ACM.
                </p>
                <p className="acm-hero-detail">
                    Workshops, industry connections, and friends beyond the classroom. Open to every
                    major at UT Austin.
                </p>
                <div className="acm-hero-actions">
                    <a
                        className="rt-button rt-primary"
                        data-join
                        href="https://discord.gg/tspJCpFFKx"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Find your people <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                    <Link className="acm-inline-link" href="/#calendar">
                        See what’s next <ArrowDown size={17} aria-hidden="true" />
                    </Link>
                </div>
                <div className="acm-hero-footnote">
                    <span>UT AUSTIN</span>
                    <span>STUDENT LED. COMMUNITY FIRST.</span>
                </div>
            </div>
            <motion.div
                className="acm-hero-visual"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                whileHover={animate ? { y: -4 } : undefined}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="acm-hero-photo">
                    <ManagedPhoto
                        slot="home"
                        src="/studio/acmformal25.webp"
                        alt="Texas ACM members together at the chapter formal"
                        width="1600"
                        height="1064"
                        fetchPriority="high"
                        decoding="async"
                    />
                    <div className="acm-photo-note">
                        <span>TEXAS ACM</span>
                        <span>Good company, in every sense.</span>
                    </div>
                </div>
                <div className="acm-hero-stamp" aria-hidden="true">
                    <img src="/texasacm-symbol.svg" width="96" height="78" alt="" />
                </div>
                <div className="acm-hero-inset">
                    <ManagedPhoto
                        slot="gallery-1"
                        src="/studio/pwp.webp"
                        alt="Students connecting with professors at an ACM event"
                        width="800"
                        height="666"
                        loading="eager"
                        decoding="async"
                    />
                    <span>More than a major.</span>
                </div>
                <span className="acm-visual-index" aria-hidden="true">
                    01 / THE CHAPTER
                </span>
            </motion.div>
        </section>
    );
}
