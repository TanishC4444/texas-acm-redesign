import ChapterPageHero from '@/components/revamp/page-hero';
export default function AboutHero() {
    return (
        <ChapterPageHero
            photoSlot="about"
            title={'About Texas ACM'}
            description={
                'Learn about Texas ACM, its three pillars, and the officers who lead the chapter.'
            }
            image={'acmretreat25'}
            alt={'ACM friends together at retreat'}
        />
    );
}
