/** Symmetric engraved layers and light, kept behind the unchanged chapter mark. */
export default function CircuitField() {
    return (
        <div className="reveal-atmosphere" aria-hidden="true">
            <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <radialGradient id="opening-light">
                        <stop stopColor="#356b83" stopOpacity=".65" />
                        <stop offset=".65" stopColor="#142f43" stopOpacity=".3" />
                        <stop offset="1" stopColor="#09131b" />
                    </radialGradient>
                    <linearGradient id="opening-metal" x1="0" y1="0" x2="1" y2="1">
                        <stop stopColor="#89d8ed" stopOpacity=".05" />
                        <stop offset=".3" stopColor="#80bdcb" stopOpacity=".6" />
                        <stop offset=".7" stopColor="#ff9b60" stopOpacity=".35" />
                        <stop offset="1" stopColor="#fff" stopOpacity=".03" />
                    </linearGradient>
                    <filter id="opening-grain">
                        <feTurbulence baseFrequency=".9" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                </defs>
                <rect width="1600" height="1000" fill="#09131b" />
                <rect width="1600" height="1000" fill="url(#opening-light)" />
                <g className="opening-engraving" fill="none" stroke="url(#opening-metal)">
                    {Array.from({ length: 18 }, (_, i) => (
                        <rect
                            key={i}
                            x={470 - i * 15}
                            y={230 - i * 12}
                            width={660 + i * 30}
                            height={540 + i * 24}
                            rx={90 + i * 5}
                            strokeWidth={i % 4 === 0 ? 1.4 : 0.6}
                            opacity={1 - i * 0.035}
                        />
                    ))}
                    {[false, true].map((flip) => (
                        <g
                            key={String(flip)}
                            transform={flip ? 'translate(1600 0) scale(-1 1)' : undefined}
                        >
                            {Array.from({ length: 10 }, (_, i) => (
                                <path
                                    key={i}
                                    d={`M ${65 + i * 12} ${170 + i * 28} H ${270 + i * 12} Q ${300 + i * 12} ${170 + i * 28} ${300 + i * 12} ${200 + i * 28} V ${800 - i * 28} Q ${300 + i * 12} ${830 - i * 28} ${270 + i * 12} ${830 - i * 28} H ${65 + i * 12}`}
                                />
                            ))}
                        </g>
                    ))}
                </g>
                <rect width="1600" height="1000" filter="url(#opening-grain)" opacity=".035" />
            </svg>
            <div className="opening-bloom" />
        </div>
    );
}
