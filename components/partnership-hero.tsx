import ChapterPageHero from '@/components/revamp/page-hero';
export default function PartnershipHero() {
    return (
        <ChapterPageHero
            photoSlot="industry"
            title={'Corporate partnerships'}
            description={
                'Connect with UT Austin students through Texas ACM talks, events, and partnerships.'
            }
            image={'acmformal25'}
            alt={'Texas ACM students together at formal'}
        />
    );
}
