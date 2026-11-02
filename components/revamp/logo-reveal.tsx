'use client';
import { useEffect } from 'react';
export default function ChapterReveal({ onSkip }: { onSkip: () => void }) {
    useEffect(() => {
        const skip = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onSkip();
        };
        document.addEventListener('keydown', skip);
        return () => document.removeEventListener('keydown', skip);
    }, [onSkip]);
    return (
        <div className="chapter-reveal" role="status" aria-label="Texas ACM chapter introduction">
            <div className="reveal-grid" aria-hidden="true" />
            <svg className="reveal-circuit" viewBox="0 0 1200 700" fill="none" aria-hidden="true">
                <g>
                    <path d="M0 100H200L350 250H500L600 350L700 250H850L1000 100H1200" />
                    <path d="M0 600H200L350 450H500L600 350L700 450H850L1000 600H1200" />
                    <path d="M600 0V200L450 350L600 500V700" />
                    <path d="M0 350H1200" />
                </g>
                <g className="circuit-nodes">
                    {[
                        [200, 100],
                        [350, 250],
                        [500, 250],
                        [600, 350],
                        [700, 450],
                        [1000, 600],
                        [450, 350],
                        [600, 200],
                    ].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="5" />
                    ))}
                </g>
            </svg>
            <div className="reveal-corner">
                UNIVERSITY OF TEXAS AT AUSTIN
                <br />
                ASSOCIATION FOR COMPUTING MACHINERY
            </div>
            <span className="reveal-top-right">
                TEXAS ACM
                <br />
                UT AUSTIN
            </span>
            <div className="reveal-diamond" aria-hidden="true" />
            <div className="reveal-logo">
                <img className="reveal-logo-base" src="/texasacm-logo-white.svg" alt="Texas ACM" />
                {Array.from({ length: 8 }, (_, i) => (
                    <img
                        key={i}
                        className={`logo-slice slice-${i}`}
                        src="/texasacm-logo-white.svg"
                        alt=""
                        aria-hidden="true"
                    />
                ))}
                <img
                    className="logo-channel channel-orange"
                    src="/texasacm-logo-white.svg"
                    alt=""
                    aria-hidden="true"
                />
                <img
                    className="logo-channel channel-blue"
                    src="/texasacm-logo-white.svg"
                    alt=""
                    aria-hidden="true"
                />
            </div>
            <div className="reveal-scan" aria-hidden="true" />
            <div className="reveal-terminal">
                <span>ACADEMICS</span>
                <span>INDUSTRY</span>
                <span>COMMUNITY</span>
            </div>
            <div className="reveal-bottom">
                <span>UTCS. OPEN TO EVERY MAJOR.</span>
                <button autoFocus onClick={onSkip}>
                    Skip intro [↗]
                </button>
            </div>
            <div className="reveal-shutter shutter-left" aria-hidden="true" />
            <div className="reveal-shutter shutter-right" aria-hidden="true" />
            <div className="reveal-shutter shutter-top" aria-hidden="true" />
            <div className="reveal-shutter shutter-bottom" aria-hidden="true" />
        </div>
    );
}
