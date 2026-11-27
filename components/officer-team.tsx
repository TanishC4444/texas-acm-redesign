'use client';
import { containDialogFocus } from '@/lib/dialog-focus';
import { useEffect, useRef, useState } from 'react';
import { Github, Globe, Instagram, Linkedin, X } from 'lucide-react';
import { safeDirectoryImage, safeSiteLink } from '@/lib/site-directory';
import { useSiteDirectory } from '@/components/runtime/site-directory';
const icons = { github: Github, website: Globe, instagram: Instagram, linkedin: Linkedin };
function socials(value: string) {
    return value
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.startsWith('https://') && safeSiteLink(url))
        .map((url) => {
            const host = new URL(url).hostname.replace(/^www\./, '');
            const iconType: keyof typeof icons =
                host === 'github.com'
                    ? 'github'
                    : host === 'instagram.com'
                      ? 'instagram'
                      : host === 'linkedin.com'
                        ? 'linkedin'
                        : 'website';
            return {
                url,
                iconType,
                name: {
                    github: 'GitHub',
                    instagram: 'Instagram',
                    linkedin: 'LinkedIn',
                    website: 'website',
                }[iconType],
            };
        });
}
export default function OfficerTeam() {
    const { entries } = useSiteDirectory('officer');
    const [selection, setSelection] = useState<string | null>(null);
    const selected = entries.find((entry) => entry.id === selection);
    const profileOpen = Boolean(selected);
    const selectedSocials = selected ? socials(selected.links) : [];
    const dialog = useRef<HTMLDialogElement>(null);
    const trigger = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        if (!profileOpen) return;
        const profile = dialog.current;
        profile?.showModal();
        return () => {
            profile?.close();
            trigger.current?.focus();
        };
    }, [profileOpen]);
    return (
        <section className="officer-directory studio-section" aria-label="Texas ACM officers">
            <div className="officer-grid">
                {entries.map((officer) => (
                    <button
                        className="officer-card"
                        data-track="open-officer-profile"
                        key={officer.id}
                        onClick={(e) => {
                            trigger.current = e.currentTarget;
                            setSelection(officer.id);
                        }}
                        aria-haspopup="dialog"
                    >
                        <span className="acm-officer-portrait">
                            {safeDirectoryImage(officer.image) ? (
                                <img
                                    src={officer.image}
                                    alt=""
                                    width="480"
                                    height="600"
                                    loading="lazy"
                                    decoding="async"
                                />
                            ) : (
                                <span className="acm-no-portrait" aria-hidden="true">
                                    {officer.title.slice(0, 1)}
                                </span>
                            )}
                        </span>
                        <h2 className="officer-card-name">{officer.title}</h2>
                        <p>{officer.category}</p>
                    </button>
                ))}
            </div>
            {selected && (
                <dialog
                    onKeyDown={containDialogFocus}
                    ref={dialog}
                    className="officer-profile"
                    aria-labelledby="officer-profile-name"
                    aria-describedby="officer-profile-bio"
                    onCancel={(e) => {
                        e.preventDefault();
                        setSelection(null);
                    }}
                >
                    <button
                        className="officer-profile-close"
                        autoFocus
                        onClick={() => setSelection(null)}
                        aria-label="Close officer profile"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                    <div className="officer-profile-heading">
                        {safeDirectoryImage(selected.image) ? (
                            <img src={selected.image} alt="" width="104" height="104" />
                        ) : (
                            <span className="acm-no-portrait" aria-hidden="true">
                                {selected.title.slice(0, 1)}
                            </span>
                        )}
                        <div>
                            <h2 id="officer-profile-name">{selected.title}</h2>
                            <p className="officer-profile-role">{selected.category}</p>
                        </div>
                    </div>
                    <p className="officer-profile-bio" id="officer-profile-bio">
                        {selected.description}
                    </p>
                    {selectedSocials.length > 0 && (
                        <div className="officer-profile-socials">
                            {selectedSocials.map((social) => {
                                const Icon = icons[social.iconType] || Globe;
                                return (
                                    <a
                                        key={social.url}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${selected.title} on ${social.name}`}
                                    >
                                        <Icon size={17} />
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </dialog>
            )}
        </section>
    );
}
