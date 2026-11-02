/** Decorative chapter illustration; the official Texas ACM logo remains separate. */
export default function ChipCharacter() {
    return (
        <svg className="chip-character" viewBox="0 0 320 300" fill="none" aria-hidden="true">
            <defs>
                <linearGradient
                    id="chip-shell"
                    x1="60"
                    y1="40"
                    x2="250"
                    y2="250"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#ffad52" />
                    <stop offset=".5" stopColor="#ff7020" />
                    <stop offset="1" stopColor="#f54b14" />
                </linearGradient>
            </defs>
            <ellipse cx="162" cy="266" rx="100" ry="15" fill="#087ac5" opacity=".15" />
            <g className="chip-body">
                {[78, 112, 146, 180, 214].map((y) => (
                    <g key={y} stroke="#087ac5" strokeWidth="12">
                        <path d={`M40 ${y}h32M248 ${y}h32`} />
                    </g>
                ))}
                <path d="M93 45h130l30 30v143l-26 28H93l-28-28V74z" fill="#09284a" />
                <path
                    d="M87 36h130l30 30v143l-26 28H87l-28-28V65z"
                    fill="url(#chip-shell)"
                    stroke="#09284a"
                    strokeWidth="4"
                />
                <path d="M83 70h133M83 80h60" stroke="#fff5dc" strokeWidth="3" opacity=".7" />
                <rect x="88" y="100" width="129" height="76" rx="32" fill="#082849" />
                <g className="chip-eyes" fill="#fff7db">
                    <rect x="111" y="119" width="19" height="32" rx="9" />
                    <rect x="173" y="119" width="19" height="32" rx="9" />
                </g>
                <path
                    d="M134 190q19 18 38 0"
                    stroke="#082849"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
                <path
                    d="M98 237l-8 23H66M210 237l8 23h24"
                    stroke="#082849"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <path
                    d="M249 179q30 4 38-21"
                    stroke="#087ac5"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <path
                    d="M283 156l-4-13m8 12 8-10m-6 15 14-2"
                    stroke="#087ac5"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
            </g>
            <path
                d="M21 39v22m-11-11h22M276 37l8 11 13-3-8 11 5 13-13-6-11 8 2-14-10-9 13-1z"
                stroke="#087ac5"
                strokeWidth="3"
            />
        </svg>
    );
}
