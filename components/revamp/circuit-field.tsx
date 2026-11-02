/** Decorative circuit artwork; no telemetry, fabricated readings, or interactive controls. */
export default function CircuitField() {
    const routes = Array.from({ length: 14 }, (_, i) => {
        const y = 65 + i * 67,
            inset = 100 + (i % 4) * 38;
        return `M 0 ${y} H ${inset} L ${inset + 55} ${y + (i % 2 ? 45 : -45)} H ${370 + (i % 3) * 30} L ${445 + (i % 3) * 30} ${310 + i * 26} H ${620 - i * 8}`;
    });
    return (
        <div className="circuit-field" aria-hidden="true">
            <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <linearGradient id="pcb-wire">
                        <stop stopColor="#16639a" />
                        <stop offset=".5" stopColor="#47cbff" />
                        <stop offset="1" stopColor="#f47721" />
                    </linearGradient>
                    <radialGradient id="pcb-glow">
                        <stop stopColor="#087ac5" stopOpacity=".3" />
                        <stop offset="1" stopColor="#087ac5" stopOpacity="0" />
                    </radialGradient>
                    <pattern id="pcb-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <circle cx="12" cy="12" r=".8" fill="#7abbd5" opacity=".2" />
                    </pattern>
                </defs>
                <rect width="1600" height="1000" fill="#0a111b" />
                <rect width="1600" height="1000" fill="url(#pcb-grid)" />
                <ellipse cx="800" cy="500" rx="750" ry="550" fill="url(#pcb-glow)" />
                {[false, true].map((flip) => (
                    <g
                        key={String(flip)}
                        transform={flip ? 'translate(1600 0) scale(-1 1)' : undefined}
                    >
                        {routes.map((d, i) => (
                            <g key={i}>
                                <path d={d} className="pcb-trace" />
                                <path d={d} className={`pcb-pulse pulse-${i % 4}`} />
                                <circle
                                    cx={100 + (i % 4) * 38}
                                    cy={65 + i * 67}
                                    r="4"
                                    className="pcb-pad"
                                />
                            </g>
                        ))}
                        {[90, 280, 695, 860].map((y, i) => (
                            <g key={y} className="pcb-component">
                                <rect x={180 + (i % 2) * 130} y={y} width="95" height="55" rx="3" />
                                {Array.from({ length: 7 }, (_, pin) => (
                                    <path
                                        key={pin}
                                        d={`M ${188 + pin * 12 + (i % 2) * 130} ${y - 10} v 10 M ${188 + pin * 12 + (i % 2) * 130} ${y + 55} v 10`}
                                    />
                                ))}
                            </g>
                        ))}
                    </g>
                ))}
                <g className="pcb-core">
                    <rect x="600" y="305" width="400" height="390" rx="16" />
                    <rect x="625" y="330" width="350" height="340" rx="8" />
                    {Array.from({ length: 18 }, (_, i) => (
                        <path
                            key={i}
                            d={`M ${617 + i * 21} 280 v 25 M ${617 + i * 21} 695 v 25 M 575 ${320 + i * 21} h 25 M 1000 ${320 + i * 21} h 25`}
                        />
                    ))}
                </g>
                <g className="pcb-corners">
                    {[
                        [45, 45],
                        [1555, 45],
                        [45, 955],
                        [1555, 955],
                    ].map(([x, y], i) => (
                        <g key={i}>
                            <circle cx={x} cy={y} r="13" />
                            <circle cx={x} cy={y} r="5" />
                        </g>
                    ))}
                </g>
            </svg>
            <div className="pcb-vignette" />
        </div>
    );
}
