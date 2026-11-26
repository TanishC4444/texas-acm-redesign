'use client';

import { useSiteDirectory } from './site-directory';
import { partnerTiers, safeDirectoryImage, safeSiteLink } from '@/lib/site-directory';

export default function Companies() {
    const { entries } = useSiteDirectory('partner');
    const companies = entries.filter((entry) => safeSiteLink(entry.url));
    if (!companies.length) return null;
    return (
        <section
            className="acm-companies"
            aria-label="Current partners and past event collaborators"
        >
            <p className="acm-eyebrow">CURRENT PARTNERS & PAST EVENT COLLABORATORS</p>
            <div className="acm-partner-logos">
                {companies.map(({ id, title, image, url }) => (
                    <a href={url} target="_blank" rel="noopener noreferrer" key={id}>
                        {safeDirectoryImage(image) ? (
                            <img
                                src={image}
                                alt={title}
                                width="160"
                                height="60"
                                loading="lazy"
                                decoding="async"
                            />
                        ) : (
                            title
                        )}
                    </a>
                ))}
            </div>
        </section>
    );
}

export function PartnerDirectory() {
    const { entries } = useSiteDirectory('partner');
    return (
        <section className="acm-partner-directory" id="partners">
            <h2>Our partners</h2>
            {partnerTiers
                .filter((tier) => tier !== 'Banner only')
                .map((tier) => {
                    const partners = entries.filter(
                        (partner) => partner.category === tier && safeSiteLink(partner.url),
                    );
                    if (!partners.length) return null;
                    return (
                        <section
                            className="acm-sponsor-tier"
                            key={tier}
                            data-tier={tier.toLowerCase()}
                        >
                            <h3>{tier}</h3>
                            <div>
                                {partners.map(({ id, title, url, image }) => (
                                    <a
                                        href={url}
                                        key={id}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {safeDirectoryImage(image) ? (
                                            <img
                                                src={image}
                                                alt={title}
                                                width="200"
                                                height="90"
                                                loading="lazy"
                                            />
                                        ) : (
                                            title
                                        )}
                                    </a>
                                ))}
                            </div>
                        </section>
                    );
                })}
        </section>
    );
}

export function CorporateContact({ label }: { label: string }) {
    const { entries } = useSiteDirectory('contact');
    const corporate = entries.find(({ id }) => id === 'corporate-contact');
    return corporate && safeSiteLink(corporate.url, true) ? (
        <a className="rt-button rt-primary" href={corporate.url}>
            {label}
        </a>
    ) : null;
}
