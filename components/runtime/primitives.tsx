'use client';
import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import { useRuntime } from './provider';
export function Decode({ text }: { text: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const { settings } = useRuntime();
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.textContent = text;
        if (
            settings.motion === 'off' ||
            settings.motion === 'reduced' ||
            (settings.motion === 'auto' && matchMedia('(prefers-reduced-motion: reduce)').matches)
        )
            return;
        let timer: ReturnType<typeof setInterval> | undefined;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            let frame = 0;
            timer = setInterval(() => {
                frame++;
                if (!el) return;
                el.textContent = text
                    .split('')
                    .map((c, i) =>
                        c === ' ' || i < (frame / 12) * text.length
                            ? c
                            : '01/[]<>'.charAt((i + frame) % 7),
                    )
                    .join('');
                if (frame >= 12) {
                    clearInterval(timer);
                    el.textContent = text;
                }
            }, 32);
        });
        observer.observe(el);
        return () => {
            observer.disconnect();
            clearInterval(timer);
            el.textContent = text;
        };
    }, [text, settings.motion]);
    return (
        <>
            <span className="sr-only">{text}</span>
            <span ref={ref} aria-hidden="true">
                {text}
            </span>
        </>
    );
}
export function PageIntro({
    label,
    title,
    description: _description,
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

            {_description && <p className="acm-page-description">{_description}</p>}
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
