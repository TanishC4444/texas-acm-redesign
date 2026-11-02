'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Users,
    CalendarDays,
    Library,
    Handshake,
    ShieldCheck,
    Sun,
    Moon,
    MessageCircle,
} from 'lucide-react';
const destinations = [
    { href: '/', label: 'Explore', icon: Home },
    { href: '/about', label: 'People', icon: Users },
    { href: '/events', label: 'Events', icon: CalendarDays },
    { href: '/resources', label: 'Resources', icon: Library },
    { href: '/partnership', label: 'Partners', icon: Handshake },
    { href: '/officer', label: 'Officers', icon: ShieldCheck },
];
export default function VisualControls() {
    const path = usePathname();
    const [dark, setDark] = useState(false);
    const [wipe, setWipe] = useState(false);
    useEffect(() => {
        let saved: string | null = null;
        try {
            saved = localStorage.getItem('acm-theme');
        } catch {}
        const value = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
        setDark(value);
        document.documentElement.dataset.theme = value ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', value);
    }, []);
    function toggle() {
        const value = !dark;
        setWipe(true);
        setDark(value);
        document.documentElement.dataset.theme = value ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', value);
        try {
            localStorage.setItem('acm-theme', value ? 'dark' : 'light');
        } catch {}
        setTimeout(() => setWipe(false), 750);
    }
    return (
        <>
            {wipe && (
                <div
                    className={`theme-wipe ${dark ? 'wipe-dark' : 'wipe-light'}`}
                    aria-hidden="true"
                />
            )}
            <nav className="glass-dock" aria-label="Page dock">
                {destinations.map((d) => (
                    <Link
                        href={d.href}
                        key={d.href}
                        aria-current={path === d.href ? 'page' : undefined}
                        className={path === d.href ? 'dock-active' : ''}
                    >
                        <d.icon size={22} />
                        <span>{d.label}</span>
                    </Link>
                ))}
                <span className="dock-divider" />
                <a href="/#join" aria-label="Connect with Texas ACM">
                    <MessageCircle size={22} />
                    <span>Connect</span>
                </a>
                <button
                    onClick={toggle}
                    aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {dark ? <Sun size={22} /> : <Moon size={22} />}
                    <span>{dark ? 'Light' : 'Dark'}</span>
                </button>
            </nav>
        </>
    );
}
