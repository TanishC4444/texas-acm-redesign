'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { firebaseApp, firebaseConfigured } from '@/lib/firebase/app';
import { defaultsByKind } from '@/lib/site-directory-defaults';
import {
    directoryEntry,
    mergeDirectory,
    directoryKinds,
    type DirectoryEntry,
    type DirectoryKind,
} from '@/lib/site-directory';

const Directory = createContext<{
    items: DirectoryEntry[];
    status: 'loading' | 'ready' | 'unavailable';
}>({
    items: [],
    status: 'loading',
});

export function SiteDirectoryProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<DirectoryEntry[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>(
        firebaseConfigured ? 'loading' : 'unavailable',
    );
    useEffect(() => {
        if (!firebaseConfigured) return;
        let closed = false;
        let unsubscribe: (() => void) | undefined;
        void import('firebase/firestore')
            .then(({ collection, onSnapshot, getFirestore }) => {
                if (closed) return;
                unsubscribe = onSnapshot(
                    collection(getFirestore(firebaseApp()), 'siteDirectory'),
                    (snapshot) => {
                        setItems(
                            snapshot.docs.flatMap((doc) => {
                                const data = doc.data();
                                if (!directoryKinds.includes(data.kind)) return [];
                                return [
                                    directoryEntry(data.kind, doc.id, data.title, {
                                        description: data.description ?? '',
                                        category: data.category ?? '',
                                        url: data.url ?? '',
                                        image: data.image ?? '',
                                        links: data.links ?? '',
                                        hidden: data.hidden === true,
                                    }),
                                ];
                            }),
                        );
                        setStatus('ready');
                    },
                    () => setStatus('unavailable'),
                );
            })
            .catch(() => {
                if (!closed) setStatus('unavailable');
            });
        return () => {
            closed = true;
            unsubscribe?.();
        };
    }, []);
    return <Directory.Provider value={{ items, status }}>{children}</Directory.Provider>;
}

export function useSiteDirectory(kind: DirectoryKind, includeHidden = false) {
    const { items, status } = useContext(Directory);
    const entries = useMemo(() => {
        const merged = mergeDirectory(defaultsByKind[kind], items, kind);
        return includeHidden ? merged : merged.filter((entry) => !entry.hidden);
    }, [includeHidden, items, kind]);
    return { entries, status };
}
