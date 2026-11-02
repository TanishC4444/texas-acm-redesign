import ChapterPageHero from '@/components/revamp/page-hero';
export default function CSGuideHero() {
    return (
        <ChapterPageHero
            title={'Your CS field guide.'}
            description={
                'Classes, campus, and careers. Find your footing in UT Austin computer science.'
            }
            image={'pwp'}
            alt={'Students gathering for Pancakes with Professors'}
        />
    );
}
