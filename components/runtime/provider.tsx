'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { defaults, applySettings, validateSettings, type Settings } from '@/lib/runtime-settings';
import type { RuntimeEvent } from '@/lib/runtime-calendar';
interface RuntimeContext {
    settings: Settings;
    change: (patch: Partial<Settings>) => void;
    events: RuntimeEvent[];
    status: 'loading' | 'ready' | 'error';
    openPanel: (tab?: 'pages' | 'display', query?: string) => void;
    panel: null | 'pages' | 'display';
    setPanel: (tab: null | 'pages' | 'display') => void;
    query: string;
    setQuery: (q: string) => void;
    now: number;
    notice: string;
    refreshCalendar: () => void;
    announce: (text: string) => void;
}
const Runtime = createContext<RuntimeContext | null>(null);
export const useRuntime = () => {
    const c = useContext(Runtime);
    if (!c) throw Error('Runtime provider missing');
    return c;
};
export default function RuntimeProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>({ ...defaults });
    const [ready, setReady] = useState(false);
    const [events, setEvents] = useState<RuntimeEvent[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [panel, setPanel] = useState<null | 'pages' | 'display'>(null);
    const [query, setQuery] = useState('');
    const [now, setNow] = useState(0);
    const [notice, setNotice] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    function refreshCalendar() {
        setStatus('loading');
        setRefreshKey((value) => value + 1);
    }
    useEffect(() => {
        try {
            setSettings(
                validateSettings(JSON.parse(localStorage.getItem('acm-runtime-settings') || '{}')),
            );
        } catch {
            setSettings({ ...defaults });
        }
        setReady(true);
        setNow(Date.now());
        const t = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(t);
    }, []);
    useEffect(() => {
        if (!ready) return;
        applySettings(settings);
        const media = matchMedia('(prefers-color-scheme: dark)');
        const motion = matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => applySettings(settings);
        media.addEventListener('change', update);
        motion.addEventListener('change', update);
        return () => {
            media.removeEventListener('change', update);
            motion.removeEventListener('change', update);
        };
    }, [settings, ready]);
    useEffect(() => {
        let alive = true;
        let controller: AbortController | null = null;
        async function refresh() {
            if (document.hidden) return;
            controller?.abort();
            controller = new AbortController();
            try {
                const r = await fetch('/api/calendar', { signal: controller.signal });
                if (!r.ok) throw Error();
                const data = await r.json();
                if (alive) {
                    setEvents(data.events);
                    setStatus('ready');
                }
            } catch (e) {
                if (alive && !(e instanceof DOMException && e.name === 'AbortError'))
                    setStatus('error');
            }
        }
        void refresh();
        const t = setInterval(refresh, 60000);
        document.addEventListener('visibilitychange', refresh);
        return () => {
            alive = false;
            controller?.abort();
            clearInterval(t);
            document.removeEventListener('visibilitychange', refresh);
        };
    }, [refreshKey]);
    useEffect(() => {
        if (!ready) return;
        if (
            settings.motion === 'off' ||
            settings.motion === 'reduced' ||
            (settings.motion === 'auto' && matchMedia('(prefers-reduced-motion: reduce)').matches)
        )
            return;
        const lenis = new Lenis({
            autoRaf: true,
            anchors: true,
            duration: 0.7,
            respectReducedMotion: settings.motion !== 'full',
        });
        return () => lenis.destroy();
    }, [settings.motion, ready]);
    function change(patch: Partial<Settings>) {
        const next = validateSettings({ ...settings, ...patch });
        setSettings(next);
        applySettings(next);
        try {
            localStorage.setItem('acm-runtime-settings', JSON.stringify(next));
        } catch {
            /* Settings still apply for this visit. */
        }
        setNotice(
            Object.entries(patch)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', '),
        );
    }
    function openPanel(tab: 'pages' | 'display' = 'pages', q = '') {
        setQuery(q);
        setPanel(tab);
    }
    useEffect(() => {
        function shortcut(e: KeyboardEvent) {
            const editing =
                e.target instanceof HTMLElement &&
                (e.target.isContentEditable ||
                    ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName));
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setQuery('');
                setPanel((p) => (p ? null : 'pages'));
                return;
            }
            if (editing || e.altKey || e.ctrlKey || e.metaKey || panel) return;
            if (e.key === '/') {
                e.preventDefault();
                const search = document.querySelector<HTMLInputElement>('[data-page-search]');
                if (search) search.focus();
                else openPanel();
            }
            if (e.key.toLowerCase() === 'j') {
                e.preventDefault();
                document.querySelector<HTMLElement>('[data-join]')?.focus();
            }
        }
        document.addEventListener('keydown', shortcut);
        return () => document.removeEventListener('keydown', shortcut);
    }, [panel]);
    return (
        <Runtime.Provider
            value={{
                settings,
                change,
                events,
                status,
                openPanel,
                panel,
                setPanel,
                query,
                setQuery,
                now,
                notice,
                refreshCalendar,
                announce: setNotice,
            }}
        >
            {children}
            <div className="sr-only" role="status" aria-live="polite">
                {notice}
            </div>
        </Runtime.Provider>
    );
}
