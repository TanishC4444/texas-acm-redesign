'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
export default function PageTransition() {
    const path = usePathname();
    const previous = useRef(path);
    const [visible, setVisible] = useState(false);
    const [sequence, setSequence] = useState(0);
    useLayoutEffect(() => {
        if (previous.current === path) return;
        previous.current = path;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        setSequence((s) => s + 1);
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 600);
        return () => clearTimeout(timer);
    }, [path]);
    if (!visible) return null;
    return (
        <div key={sequence} className="chapter-route-wipe" aria-hidden="true">
            <div className="wipe-band wipe-blue" />
            <div className="wipe-band wipe-orange" />
            <div className="wipe-band wipe-accent" />
            <svg className="wipe-symbol" viewBox="0 0 330 262" fill="none" strokeWidth="18">
                <rect
                    x="86.655"
                    y="131"
                    width="156.262"
                    height="156.262"
                    rx="30.5"
                    transform="rotate(-45 86.655 131)"
                    stroke="#ff791d"
                />
                <circle cx="109.5" cy="130.351" r="95" stroke="#4a8dcc" />
            </svg>
        </div>
    );
}
