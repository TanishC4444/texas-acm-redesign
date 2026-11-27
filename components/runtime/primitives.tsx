'use client';
import Link from 'next/link';
import { type ReactNode } from 'react';
export function Decode({ text }: { text: string }) {
    return <>{text}</>;
}
export function PageIntro({
    label,
    title,
    description,
    action,
}: {
    label: string;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <section className="rt-page-intro rt-cell" data-section-title={label}>
            <h1>
                <Decode text={title} />
            </h1>

            {description && <p>{description}</p>}
            {action}
        </section>
    );
}
export function Cell({
    children,
    className = '',
    id,
}: {
    children: ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <section className={`rt-cell ${className}`} id={id}>
            {children}
        </section>
    );
}
export function Join({ small = false }: { small?: boolean }) {
    return (
        <a
            className={`rt-button rt-primary ${small ? 'rt-small' : ''}`}
            data-join
            href="https://discord.gg/tspJCpFFKx"
            target="_blank"
            rel="noopener noreferrer"
            onPointerMove={(e) => {
                if (
                    e.pointerType !== 'mouse' ||
                    document.documentElement.dataset.motionResolved !== 'full'
                )
                    return;
                const r = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - r.left - r.width / 2) / r.width) * 8;
                const y = ((e.clientY - r.top - r.height / 2) / r.height) * 8;
                e.currentTarget.style.transform = `translate(${x}px,${y}px)`;
            }}
            onPointerLeave={(e) => {
                e.currentTarget.style.transform = '';
            }}
        >
            Join Discord
        </a>
    );
}
export function RouteLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link className="rt-button" href={href}>
            {children}
        </Link>
    );
}
