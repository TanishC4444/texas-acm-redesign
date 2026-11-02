import ChapterPageHero from '@/components/revamp/page-hero';
export default function AboutHero() {
    return (
        <ChapterPageHero
            title={'About Texas ACM'}
            description={
                'The people, projects, and possibilities behind your UT Austin computing community.'
            }
            image={'acmretreat25'}
            alt={'ACM friends together at retreat'}
        />
    );
}
