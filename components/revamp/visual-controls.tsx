'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
export default function VisualControls() {
    const [dark, setDark] = useState(false);
    useEffect(() => {
        setDark(document.documentElement.dataset.theme === 'dark');
    }, []);
    function toggle() {
        const value = !dark;
        setDark(value);
        document.documentElement.dataset.theme = value ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', value);
        try {
            localStorage.setItem('acm-theme', value ? 'dark' : 'light');
        } catch {
            /* The theme still applies when browser storage is unavailable. */
        }
    }
    return (
        <button
            className="dock-theme"
            data-track="toggle-theme"
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
            <span>{dark ? 'Light' : 'Dark'}</span>
        </button>
    );
}
