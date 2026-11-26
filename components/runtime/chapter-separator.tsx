export default function ChapterSeparator({ variant }: { variant: 'orbit' | 'path' }) {
    return (
        <div className={'acm-chapter-separator separator-' + variant} aria-hidden="true">
            <span className="acm-separator-rule" />
            <svg className="acm-separator-art" viewBox="0 0 260 74" fill="none">
                <path
                    className="acm-drawn-path"
                    d="M3 39C35 39 23 10 55 10S76 64 112 64S139 10 172 10S207 39 257 39"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <g className="acm-orbit-shape">
                    <circle
                        cx="130"
                        cy="37"
                        r="24"
                        fill="var(--art-orange)"
                        stroke="var(--art-ink)"
                        strokeWidth="1.5"
                    />
                    <rect
                        x="113"
                        y="20"
                        width="34"
                        height="34"
                        rx="8"
                        transform="rotate(45 130 37)"
                        fill="var(--art-lime)"
                        stroke="var(--art-ink)"
                        strokeWidth="1.5"
                    />
                    <circle cx="130" cy="37" r="6" fill="var(--art-ink)" />
                </g>
                <circle
                    className="acm-orbit-dot"
                    cx="55"
                    cy="10"
                    r="6"
                    fill="var(--art-purple)"
                    stroke="var(--art-ink)"
                />
                <circle cx="206" cy="35" r="4" fill="var(--art-orange)" />
            </svg>
            <span className="acm-separator-rule" />
        </div>
    );
}
