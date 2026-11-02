import Link from 'next/link';
import ChipCharacter from './chip-character';
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
                <ChipCharacter />
                <div className="page-hero-photo">
                    <img src={`/studio/${image}.webp`} alt={alt} fetchPriority="high" />
                </div>
            </div>
        </section>
    );
}
