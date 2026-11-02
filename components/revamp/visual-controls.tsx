'use client';
import { useEffect, useRef, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
export default function VisualControls() {
    const [dark, setDark] = useState(false);
    const [wipe, setWipe] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        let saved: string | null = null;
        try {
            saved = localStorage.getItem('acm-theme');
        } catch {}
        const value = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
        setDark(value);
        document.documentElement.dataset.theme = value ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', value);
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);
    function toggle() {
        const value = !dark;
        if (timer.current) clearTimeout(timer.current);
        setWipe(true);
        setDark(value);
        document.documentElement.dataset.theme = value ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', value);
        try {
            localStorage.setItem('acm-theme', value ? 'dark' : 'light');
        } catch {}
        timer.current = setTimeout(() => setWipe(false), 600);
    }
    return (
        <>
            {wipe && <div className="machine-theme-wipe" aria-hidden="true" />}
            <button
                className="machine-theme-toggle"
                onClick={toggle}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
                <span>{dark ? 'Light' : 'Dark'}</span>
            </button>
        </>
    );
}
