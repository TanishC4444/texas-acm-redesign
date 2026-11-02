'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition() {
    const pathname = usePathname();
    const previous = useRef(pathname);
    const [sequence, setSequence] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (previous.current === pathname) return;
        previous.current = pathname;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        setSequence((value) => value + 1);
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 760);
        return () => clearTimeout(timer);
    }, [pathname]);

    if (!visible) return null;
    return (
        <div key={sequence} className="chapter-page-transition" aria-hidden="true">
            <svg
                viewBox="0 0 330 262"
                className="chapter-transition-mark"
                fill="none"
                strokeWidth="29"
            >
                <rect
                    x="86.655"
                    y="131"
                    width="156.262"
                    height="156.262"
                    rx="30.5"
                    transform="rotate(-45 86.655 131)"
                    stroke="#ff791d"
                />
                <circle cx="109.5" cy="130.351" r="95" stroke="#008fd5" />
            </svg>
        </div>
    );
}
