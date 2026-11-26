'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const revealTargets = [
    '.rt-page-intro h1',
    '.acm-about-intro > *',
    '.acm-partner-opening > *',
    '.acm-chapter > *',
    '.acm-involvement > h2',
    '.acm-involvement-photos > article',
    '.acm-calendar-heading',
    '.acm-art-section-heading',
    '.acm-resources-heading',
    '.acm-resource-links > a',
    '.acm-packages-title',
    '.acm-package-options > article',
    '.acm-partner-directory > h2',
    '.acm-sponsor-tier',
    '.officer-grid > button',
].join(',');

export default function RouteMotion() {
    const pathname = usePathname();

    useEffect(() => {
        const main = document.getElementById('main-content');
        if (!main || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const { isIntersecting, target } of entries) {
                    if (!isIntersecting) continue;
                    if (document.documentElement.dataset.motionResolved === 'full') {
                        target.setAttribute('data-motion-entered', '');
                    }
                    observer.unobserve(target);
                }
            },
            { threshold: 0.12 },
        );

        main.querySelectorAll(revealTargets).forEach((target) => observer.observe(target));
        return () => observer.disconnect();
    }, [pathname]);

    return null;
}
