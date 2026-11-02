'use client';
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ImgHTMLAttributes,
    type ReactNode,
} from 'react';
import { firebaseApp, firebaseConfigured } from '@/lib/firebase/app';
import { validPhotoUrl, type SitePhoto } from '@/lib/site-photos';
const Photos = createContext<Record<string, SitePhoto>>({});
export function SitePhotosProvider({ children }: { children: ReactNode }) {
    const [photos, setPhotos] = useState<Record<string, SitePhoto>>({});
    useEffect(() => {
        if (!firebaseConfigured) return;
        let closed = false;
        let unsubscribe: (() => void) | undefined;
        void import('firebase/firestore')
            .then(({ collection, onSnapshot, getFirestore }) => {
                if (closed) return;
                unsubscribe = onSnapshot(
                    collection(getFirestore(firebaseApp()), 'sitePhotos'),
                    (snapshot) => {
                        const next: Record<string, SitePhoto> = {};
                        snapshot.forEach((doc) => {
                            const p = doc.data();
                            if (validPhotoUrl(p.url || '') && typeof p.alt === 'string')
                                next[doc.id] = { url: p.url, alt: p.alt };
                        });
                        setPhotos(next);
                    },
                    () => {},
                );
            })
            .catch(() => {});
        return () => {
            closed = true;
            unsubscribe?.();
        };
    }, []);
    return <Photos.Provider value={photos}>{children}</Photos.Provider>;
}
export function useSitePhoto(slot: string, src: string, alt: string) {
    return useContext(Photos)[slot] || { url: src, alt };
}
export default function ManagedPhoto({
    slot,
    src = '',
    alt = '',
    ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { slot: string; src?: string }) {
    const photo = useSitePhoto(slot, src, alt);
    return (
        <img
            {...props}
            src={photo.url}
            alt={photo.alt}
            referrerPolicy="no-referrer"
            onError={(e) => {
                if (e.currentTarget.getAttribute('src') !== src) e.currentTarget.src = src;
            }}
        />
    );
}
