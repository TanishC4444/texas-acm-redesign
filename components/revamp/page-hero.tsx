import Link from 'next/link';
import ManagedPhoto from './site-photos';
import { ArrowUpRight } from 'lucide-react';
export default function ChapterPageHero({
    title,
    description,
    image,
    alt,
    href,
    action,
    photoSlot,
}: {
    title: string;
    description: string;
    image: string;
    alt: string;
    href?: string;
    action?: string;
    photoSlot?: string;
}) {
    return (
        <section className="chapter-page-hero">
            <div className="page-hero-copy">
                <h1>{title}</h1>
                <p>{description}</p>
                {href && (
                    <Link className="space-cta" href={href}>
                        {action}
                        <ArrowUpRight size={19} />
                    </Link>
                )}
            </div>
            <div className="page-hero-art">
                <div className="page-hero-photo">
                    <ManagedPhoto
                        slot={photoSlot || `hero-${image}`}
                        src={`/studio/${image}.webp`}
                        alt={alt}
                        fetchPriority="high"
                    />
                </div>
            </div>
        </section>
    );
}
