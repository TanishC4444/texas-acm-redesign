/** Aligned, non-intersecting traces meet matching pins on the central frame. */
export default function CircuitField() {
    return (
        <div className="circuit-field" aria-hidden="true">
            <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <radialGradient id="reveal-light">
                        <stop stopColor="#2a526a" stopOpacity=".45" />
                        <stop offset="1" stopColor="#101a24" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <rect width="1600" height="1000" fill="#101a24" />
                <ellipse cx="800" cy="500" rx="700" ry="600" fill="url(#reveal-light)" />
                {[false, true].map((flip) => (
                    <g
                        key={String(flip)}
                        transform={flip ? 'translate(1600 0) scale(-1 1)' : undefined}
                    >
                        {Array.from({ length: 8 }, (_, i) => {
                            const y = 360 + i * 40;
                            return (
                                <g key={i}>
                                    <path className="pcb-trace" d={`M 100 ${y} H 580`} />
                                    <path
                                        className={`pcb-pulse pulse-${i % 4}`}
                                        d={`M 100 ${y} H 580`}
                                    />
                                    <circle className="pcb-pad" cx="100" cy={y} r="3" />
                                    <path d={`M 580 ${y} H 610`} stroke="#ff8b35" strokeWidth="2" />
                                </g>
                            );
                        })}
                    </g>
                ))}
                <g fill="none" stroke="#538399" strokeWidth="1">
                    <rect x="610" y="300" width="380" height="400" rx="24" />
                    <rect x="626" y="316" width="348" height="368" rx="16" opacity=".35" />
                </g>
            </svg>
            <div className="pcb-vignette" />
        </div>
    );
}
