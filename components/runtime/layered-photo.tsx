'use client';

import { useId } from 'react';
import ManagedPhoto, { useSitePhoto } from '@/components/revamp/site-photos';

export type HeroPhoto = {
    src: string;
    alt: string;
    slot: string;
    height: number;
    logoTop: number;
    alignTop?: boolean;
    foreground: string;
};

export default function LayeredPhoto({ photo, active }: { photo: HeroPhoto; active: boolean }) {
    const id = useId();
    const current = useSitePhoto(photo.slot, photo.src, photo.alt);
    const className = active ? 'is-active' : '';

    // The cutout is registered to the original photo's coordinates.
    if (current.url !== photo.src) {
        return (
            <div
                className={'acm-layered-photo acm-layered-fallback ' + className}
                aria-hidden={!active}
            >
                <ManagedPhoto
                    slot={photo.slot}
                    src={photo.src}
                    alt={photo.alt}
                    width={1600}
                    height={photo.height}
                    className="is-active"
                />
                <span className="acm-fallback-logo" aria-hidden="true" />
            </div>
        );
    }

    return (
        <svg
            className={'acm-layered-photo ' + className}
            viewBox={`0 0 1600 ${photo.height}`}
            preserveAspectRatio={photo.alignTop ? 'xMidYMin slice' : 'xMidYMid slice'}
            role="img"
            aria-label={current.alt}
            aria-hidden={!active}
        >
            <defs>
                <clipPath id={id}>
                    <path d={photo.foreground} />
                </clipPath>
            </defs>
            <image href={photo.src} width="1600" height={photo.height} />
            <image
                className="acm-photo-brand"
                href="/texasacm-logo-brand.svg"
                x="120"
                y={photo.logoTop}
                width="1360"
                height="271"
            />
            <image
                className="acm-photo-foreground"
                href={photo.src}
                width="1600"
                height={photo.height}
                clipPath={`url(#${id})`}
            />
        </svg>
    );
}
