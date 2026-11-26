'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SectionRedirect({
    destinations,
    fallback,
    label,
}: {
    destinations: Record<string, string>;
    fallback: string;
    label: string;
}) {
    const router = useRouter();
    useEffect(() => {
        const fragment = location.hash.slice(1);
        router.replace(Object.hasOwn(destinations, fragment) ? destinations[fragment] : fallback);
    }, [router, destinations, fallback]);
    return (
        <Link className="rt-button" href={fallback}>
            {label}
        </Link>
    );
}
