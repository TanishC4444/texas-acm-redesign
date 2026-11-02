'use client';
import { useEffect, useRef, useState } from 'react';
import { Github, Globe, Instagram, Linkedin, X } from 'lucide-react';
import { officers, type Officer } from '@/lib/officers';
const icons = { github: Github, website: Globe, instagram: Instagram, linkedin: Linkedin };
const portrait = (officer: Officer) =>
    `/studio/officers/${officer.image
        .split('/')
        .pop()!
        .replace(/\.[^.]+$/, '')}.webp`;
export default function OfficerTeam() {
    const [selected, setSelected] = useState<Officer | null>(null);
    const dialog = useRef<HTMLDialogElement>(null);
    const trigger = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        if (!selected) return;
        dialog.current?.showModal();
        return () => {
            dialog.current?.close();
            trigger.current?.focus();
        };
    }, [selected]);
    return (
        <section className="officer-directory studio-section" aria-label="Texas ACM officers">
            <div className="officer-grid">
                {officers.map((officer) => (
                    <button
                        className="officer-card"
                        data-track="open-officer-profile"
                        key={officer.name}
                        onClick={(e) => {
                            trigger.current = e.currentTarget;
                            setSelected(officer);
                        }}
                        aria-label={`About ${officer.name}, ${officer.position}`}
                    >
                        <img
                            src={portrait(officer)}
                            alt={officer.name}
                            width="480"
                            height="600"
                            loading="lazy"
                            decoding="async"
                        />
                        <h3>{officer.name}</h3>
                        <p>{officer.position}</p>
                    </button>
                ))}
            </div>
            {selected && (
                <dialog
                    ref={dialog}
                    className="officer-profile"
                    aria-labelledby="officer-profile-name"
                    onCancel={(e) => {
                        e.preventDefault();
                        setSelected(null);
                    }}
                >
                    <button
                        className="officer-profile-close"
                        autoFocus
                        onClick={() => setSelected(null)}
                        aria-label="Close officer profile"
                    >
                        <X />
                    </button>
                    <img src={portrait(selected)} alt={selected.name} width="480" height="600" />
                    <div>
                        <h2 id="officer-profile-name">{selected.name}</h2>
                        <p className="officer-profile-role">{selected.position}</p>
                        <p>{selected.bio}</p>
                        <div className="officer-profile-socials">
                            {selected.socials.map((social) => {
                                const Icon = icons[social.iconType] || Globe;
                                return (
                                    <a
                                        key={social.url}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${selected.name} on ${social.name}`}
                                    >
                                        <Icon size={22} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </dialog>
            )}
        </section>
    );
}
