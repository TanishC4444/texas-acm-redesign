'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { firebaseApp, firebaseConfigured } from '@/lib/firebase/app';
export default function SiteAnalytics() {
    const path = usePathname();
    const last = useRef('');
    useEffect(() => {
        if (
            !firebaseConfigured ||
            navigator.doNotTrack === '1' ||
            /^\/(officer|signin|designs)(\/|$)/.test(path)
        ) {
            last.current = '';
            return;
        }
        const record = async (type: 'view' | 'click', target = '') => {
            // No query strings, visitor IDs, cookies, form values, or account data.
            try {
                const { addDoc, collection, getFirestore, serverTimestamp } =
                    await import('firebase/firestore');
                await addDoc(collection(getFirestore(firebaseApp()), 'siteActivity'), {
                    type,
                    path,
                    target,
                    recordedAt: serverTimestamp(),
                });
            } catch {
                /* Analytics must never block navigation. */
            }
        };
        if (last.current !== path) {
            last.current = path;
            record('view');
        }
        let latest = 0;
        const click = (e: MouseEvent) => {
            const node = (e.target as Element)?.closest('a,button');
            if (!node || node.closest('form,dialog') || Date.now() - latest < 500) return;
            let target = '';
            if (node instanceof HTMLAnchorElement) {
                const url = new URL(node.href, location.origin);
                if (!['http:', 'https:'].includes(url.protocol)) return;
                target =
                    url.origin === location.origin
                        ? url.pathname + url.hash
                        : url.hostname + url.pathname;
            } else {
                // Explicit static control labels only; never scrape arbitrary displayed text.
                target = node.getAttribute('data-track') || '';
            }
            if (!target || target.length > 180) return;
            latest = Date.now();
            record('click', target);
        };
        document.addEventListener('click', click);
        return () => document.removeEventListener('click', click);
    }, [path]);
    return null;
}
