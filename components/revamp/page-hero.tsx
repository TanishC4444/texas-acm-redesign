import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export default function ChapterPageHero({
    title,
    description,
    image,
    alt,
    href,
    action,
}: {
    title: string;
    description: string;
    image: string;
    alt: string;
    href?: string;
    action?: string;
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
                <div className="page-hero-orbit" aria-hidden="true" />
                <div className="page-hero-photo">
                    <img src={`/studio/${image}.webp`} alt={alt} fetchPriority="high" />
                </div>
                <div className="page-hero-tile" aria-hidden="true">
                    &lt;/&gt;
                </div>
            </div>
        </section>
    );
}
